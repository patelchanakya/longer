// import { useState, useEffect } from "react";

type Item = {
  success: boolean;
  message: string;
  processedAudioFile?: File;
  newPosition?: string; // change this to string
};
export default function FileList() {
  // const [data, setData] = useState<Item>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const formData = new FormData();
  //     // set up formData as needed
  //     //   const result = await fetcher(formData);
  //     //   setData(result);
  //   };

  //   fetchData();
  // }, []);

  //   if (!data) {
  //     return null; // or a loading spinner
  //   }
  return (
    <div className="flex items-center flex-col  max-w-xl gap-4 text-foreground">
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <h2
        className="text-xl font-bold font-bold text-center"
        style={{ color: "darkslategray" }}
      >
        Your Files

          
      </h2>
      {/* render loading audio */}
      <div className="flex flex-col gap-4">
        {/* {processedAudioFile && (processedAudioFile)} */}
        <div></div>
      </div>
    </div>
  );
}
