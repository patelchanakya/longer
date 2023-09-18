"use client";

import React, { useState } from "react";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import FileSingle from "./FileSingle";

type SharedClientProps = {
  userSession: User;
};

export function FileList({ userSession }: SharedClientProps) {
  const [files, setFiles] = useState<
    { gen_file: string; gen_filename: string; audio_filename: string }[]
  >([]);
  const supabase = createClientComponentClient({});

  const fetchUserFiles = async () => {
    try {
      const { data: userFiles, error } = await supabase
        .from("mas_generations")
        .select("gen_file, audio_filename, gen_filename") // Include the new fields in the select statement
        .eq("user_id", userSession.id);

      if (error) {
        console.error("Error fetching user files:", error);
        return;
      }

      const fetchedFiles = userFiles && userFiles.length > 0 ? userFiles : [];
      setFiles(fetchedFiles);

      if (userFiles) {
        const fetchedFiles = userFiles.length > 0 ? userFiles : [];
        setFiles(fetchedFiles);
      } else {
        console.log("No files found for this user.");
      }
    } catch (error) {
      console.error("Error fetching user files:", error);
    }
  };

  React.useEffect(() => {
    // fetch initial user files
    fetchUserFiles();

    const channel = supabase.channel("realtime-longer");

    channel
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "mas_generations" },
        (payload) => {
          console.log("New file received!", payload);
          // Update the files state directly
          setFiles((prevFiles) => [
            ...prevFiles,
            payload.new as {
              gen_file: any;
              gen_filename: any;
              audio_filename: any;
            },
          ]);
        }
      )
      .subscribe();

    console.log(files); // Add this line
  }, []);

  if (files.length === 0) {
    return null; // Don't render the component if there are no files
  }
  return (
    <div className="w-full min-h-full flex-grow flex items-center flex-col gap-4 text-foreground">
      {/* render loading audio */}
      <div className="flex flex-col w-full h-full gap-4">
        {files
          .filter((file) => file.gen_file)
          .map((file) => (
            <FileSingle key={file.gen_file} file={file} />
          ))}
      </div>
    </div>
  );
}
