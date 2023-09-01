'use server'

// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Function to upload a file to the 'masfiles' bucket and return the public URL
async function uploadBucketFile(supabase: any, filePath: string, fileBuffer: Buffer, fileType: string): Promise<string> {
  // Convert the Buffer to a Blob
  const fileBlob = new Blob([fileBuffer], { type: fileType });

  // Upload the Blob to the 'masfiles' bucket
  const { data, error } = await supabase
    .storage
    .from('masfiles')
    .upload(filePath, fileBlob, {
      upsert: true
    });

  // Handle file upload error
  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  // Get the public URL of the uploaded file
  const { data: { publicUrl } } = await supabase.storage.from('masfiles').getPublicUrl(filePath);
  return publicUrl;
}

async function processFile(supabase: any, audioFileBlob: Blob, processedBucketFileName: string): Promise<string> {


  // Convert Blob to Buffer
  const audioFileArrayBuffer = await audioFileBlob.arrayBuffer();
  const audioFileBuffer = Buffer.from(audioFileArrayBuffer);

  // Upload the processed file (which is just the original file with a new name)
  const processedFileUrl = await uploadBucketFile(supabase, processedBucketFileName, audioFileBuffer, audioFileBlob.type);
  console.log('Processed file uploaded:', processedFileUrl);

  // Return the URL of the processed file
  return processedFileUrl;
}

async function insertRecord(supabase: any, userId: string, audioFileUrl: string, processedFileUrl: string, audioFileName: string, genFileName: string): Promise<any> {
  const { error, data } = await supabase
    .from('mas_generations')
    .insert([
      {
        audio_file: audioFileUrl,
        audio_filename: audioFileName,
        gen_filename: genFileName,
        status: 'processed', // Or whatever status you want to set
        gen_file: processedFileUrl,
        created_at: new Date(),
        user_id: userId
      },
    ]);

  // Handle insert error
  if (error) {
    console.error('Error inserting record:', error);
    return NextResponse.json({ success: false, message: `Error inserting record: ${error.message}` }, { status: 500 });
  }

  // Return the inserted record
  return data;
}

async function getUserCredits(supabase: any, userId: string): Promise<number> {
  const { data: user_credits, error } = await supabase
    .from('user_credits')
    .select('credit_amount')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user credits:', error);
    throw error;
  }

  return user_credits[0].credit_amount;
}

async function deductCredits(supabase: any, userId: string, amount: number): Promise<number> {
  const currentCredits = await getUserCredits(supabase, userId);
  const newCredits = currentCredits - amount;

  const { error } = await supabase
    .from('user_credits')
    .update({ credit_amount: newCredits })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }

  return newCredits; // Return the updated credits
}

type UserFile = {
  gen_file: string;
};

async function fetchUserFiles(supabase: any, userId: string): Promise<UserFile[]> {
  const { data: userFiles, error } = await supabase
    .from('mas_generations')
    .select('gen_file')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user files:', error);
    throw new Error(error.message);
  }

  if (!userFiles) {
    throw new Error('No user files found');
  }

  return userFiles;
}

export async function POST(request: NextRequest) {
  console.log('POST request received');
  const supabase = createServerActionClient({ cookies });

  // Get the current user's session
  const { data: { user } } = await supabase.auth.getUser();
  console.log('User session retrieved');

  // Check if the user is logged in
  if (!user) {
    console.log('User not logged in');
    return NextResponse.json({ success: false, message: 'Login first, sneaky hacker' }, { status: 401 });
  }

  const formData = await request.formData();
  const audioFileBlob = formData.get("audio") as Blob; // Get the audio file from the form data 
  const sliderValue = Number(formData.get("slider"));
  console.log('Form data parsed');

  // Check if a file was selected
  if (!audioFileBlob || !audioFileBlob.name) {
    console.log('No file selected');
    return NextResponse.json({ success: false, message: 'No file selected. Please select a file.' }, { status: 400 });
  }

  // Convert Blob to Buffer
  const audioFileArrayBuffer = await audioFileBlob.arrayBuffer();
  const audioFileBuffer = Buffer.from(audioFileArrayBuffer);
  console.log('Blob converted to Buffer');

  // Generate unique file names for the original audio file and the processed file
  const audioBucketFileName = `${user.id}/audio/${audioFileBlob.name}-${Date.now()}`;
  const processedBucketFileName = `${user.id}/processed/new-${audioFileBlob.name}-${Date.now()}`;

  let audioFileName = audioFileBlob.name;
  let genFileName = `generated-${audioFileBlob.name}`; // Or however you generate the name of the processed file


  let audioFileUrl: string;
  let processedFileUrl: string;
  let updatedCredits: number;
  let record: any;
  let updatedFiles: any;

  // Upload the original audio file
  if (audioFileBuffer) {
    audioFileUrl = await uploadBucketFile(supabase, audioBucketFileName, audioFileBuffer, audioFileBlob.type);
    console.log('Original file uploaded:', audioFileUrl);

    // Deduct the slider value from the user's credits
    updatedCredits = await deductCredits(supabase, user.id, sliderValue);
    console.log('Original file uploaded:', updatedCredits);

    // Process the file
    processedFileUrl = await processFile(supabase, audioFileBlob, processedBucketFileName);
    console.log('Processed file uploaded:', processedFileUrl);

    // Insert a record into the 'mas_generations' table
    record = await insertRecord(supabase, user.id, audioFileUrl, processedFileUrl, audioFileName, genFileName);
    console.log('Record inserted:', record);

    try {
      // Fetch the updated list of user files
      updatedFiles = await fetchUserFiles(supabase, user.id);
      console.log('Updated files:', updatedFiles);
    } catch (error) {
      console.error('Error fetching updated user files:', error);
      return NextResponse.json({ success: false, message: `Error fetching updated user files: ${error}` }, { status: 500 });
    }


  } else {
    console.error('Error uploading files. Return to client.');
    return NextResponse.json({ success: false, message: `Error uploading files...` }, { status: 400 });
  }

  // Return a success response with the URLs of the uploaded files
  return NextResponse.json({ success: true, audioFileUrl, processedFileUrl, updatedCredits, updatedFiles });
};