import { NextRequest, NextResponse } from "next/server";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import fetch from "node-fetch";

async function uploadBucketFile(
  supabase: any,
  filePath: string,
  fileBuffer: Buffer,
  fileType: string
): Promise<string> {
  // Convert the Buffer to a Blob
  const fileBlob = new Blob([fileBuffer], { type: fileType });

  // Upload the Blob to the 'masfiles' bucket
  const { data, error } = await supabase.storage
    .from("masfiles")
    .upload(filePath, fileBlob, {
      upsert: true,
    });

  // Handle file upload error
  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  // Get the public URL of the uploaded file
  const {
    data: { publicUrl },
  } = await supabase.storage.from("masfiles").getPublicUrl(filePath);
  return publicUrl;
}

async function updateRecord(
  supabase: any,
  taskId: string,
  processedFileUrl: string
): Promise<any> {
  const { error } = await supabase
    .from("mas_generations")
    .update({ gen_file: processedFileUrl })
    .eq("task_id", taskId); // Use 'task_id' instead of 'id'

  // Handle update error
  if (error) {
    console.error("Error updating record:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  console.log("POST request received"); // Log when a POST request is received

  const supabase = createServerComponentClient({
    cookies,
  });

  // Parse the incoming JSON payload
  // Parse the incoming JSON payload
  const prediction = (await request.json()) as {
    id: string;
    output: any;
    status: string;
  };
  console.log("Prediction received:", prediction); // Log the received prediction

  // Check if the prediction was successful
  if (prediction.status === "succeeded") {
    console.log("Prediction succeeded"); // Log when the prediction has succeeded

    // Download the processed audio file
    const response = await fetch(prediction.output, {
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_KEY}`,
      },
    });
    const arf = await response.arrayBuffer();
    const processedAudioFileBuffer = Buffer.from(arf);

    // Generate a unique file name for the processed audio file
    const processedBucketFileName = `processed/new-${prediction.id}`;

    // Upload the processed audio file to a bucket
    const processedFileUrl = await uploadBucketFile(
      supabase,
      processedBucketFileName,
      processedAudioFileBuffer,
      "audio/wav" // Replace with the actual MIME type of the processed audio file
    );
    console.log("Processed file URL:", processedFileUrl); // Log the URL of the processed file

    // Update the 'mas_generations' table with the URL of the processed audio file
    // Replace 'updateRecord' with your actual function for updating the record
    await updateRecord(supabase, prediction.id, processedFileUrl);
    console.log("Record updated"); // Log when the record has been updated
  }

  // Return a 200 OK response
  console.log("Returning response"); // Log before returning the response

  return NextResponse.json({
    success: true,
  }) as any;
}
