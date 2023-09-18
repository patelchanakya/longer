import React from "react";

type FileSingleProps = {
  file: {
    gen_file: string;
    gen_filename: string;
    audio_filename: string;
  };
};

const MemoizedFileSingle: React.FC<FileSingleProps> = ({ file }) => {
  const audioType =
    file.gen_file && file.gen_file.endsWith(".wav")
      ? "audio/wav"
      : "audio/mpeg";
  // get file.gen_file and remove "" from the string
  const preparedgen_file = file.gen_file.replace(/['"]+/g, "");

  return (
    <div className="flex flex-row w-full min-h-full gap-4">
      <audio preload="auto" controls>
        <source src={preparedgen_file} type={audioType} />
        Your browser does not support the audio element.
      </audio>
      <div className="flex flex-col items-left">
        <p>{file.gen_filename} </p>
        <a href={preparedgen_file} download className=" text-blue underline">
          Download
        </a>{" "}
        {/* Download button */}
      </div>{" "}
      {/* Display the generated file name */}
    </div>
  );
};

const FileSingle = React.memo(MemoizedFileSingle);

export default FileSingle;
