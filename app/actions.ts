"use server";

export async function fetcher(formData: FormData) {
  try {
    // Assign the audioFile and position values to variables
    const audioFile = formData.get("audioFile") as File;
    const position = formData.get("position") as string;

    console.log("audioFile:", audioFile);
    console.log("position:", position);

    // Process the audioFile and position variables for replicate api

    //  const response = await fetch("/api/process", {
    //    method: "POST",
    //    body: data,
    //  });

    // If processing was successful
    return { success: true, message: "File processed successfully." };
  } catch (error) {
    // If there was an error
    console.error(error);
    return {
      success: false,
      message: "An error occurred while processing the file.",
    };
  }
}
