"use client";

import { Label } from "./ui/ui/label";
import { Input } from "./ui/ui/input";
import {
  createClientComponentClient,
  createServerActionClient,
} from "@supabase/auth-helpers-nextjs";
// import { useEffect, useTransition } from "react";
import * as React from "react";
import { Button } from "../components/ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/ui/dropdown-menu";
import { sendGeneration } from "../app/actions";
import LoginButton from "./LoginButton";
// import { cookies } from "next/headers";
import { DropdownMenuRadioGroupDemo } from "./RadioGroup";

export default function Uploader() {
  const [position, setPosition] = React.useState("20");
  // const [position, setPosition] = React.useState("20"); // state for dropdown menu
  // const [name, changeName] = React.useState<File | null>(null);
  // const [userCredits, setUserCredits] = React.useState<any>(null);
  // let [isPending, startTransition] = useTransition();
  // const [isLoading, setIsLoading] = React.useState(false);

  // const [song, setSong] = React.useState<string | undefined | null>(null);
  // const [position, setPosition] = React.useState("bottom");\

  // if (title) {
  //   // Create a Supabase client configured to use cookies
  //   const supabase = createServerActionClient({ cookies });

  //   // This assumes you have a `todos` table in Supabase. Check out
  //   // the `Create Table and seed with data` section of the README 👇
  //   // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
  //   await supabase.from("todos").insert({ title });
  //   // revalidatePath("/server-action-example");
  // }
  // };
  // // Get the user's session if there is one
  // useEffect(() => {
  //   const fetchUserCredits = async () => {
  //     const { data, error } = await supabase
  //       .from("user_credits")
  //       .select("credit_amount")
  //       .eq("user_id", userstat?.id);

  //     if (error) {
  //       console.error("Error fetching user credits:", error);
  //     } else if (data) {
  //       setUserCredits(data);
  //     }
  //   };

  //   if (userstat) {
  //     fetchUserCredits();
  //   }
  // }, [supabase, userstat]);

  // useEffect(() => {
  //   if (name instanceof Blob) {
  //     let reader = new FileReader();

  //     reader.onload = function () {
  //       // console.log(reader.result);
  //     };

  //     reader.onerror = function () {
  //       console.log(reader.error);
  //     };

  //     reader.readAsText(name);

  //     const objectUrl = URL.createObjectURL(name);
  //     console.log(objectUrl);
  //     setSong(objectUrl);
  //   }
  // }, [name]); // Including name in the dependency array

  return (
    <div className="grid w-full max-w-md items-center bg-white py-6 px-10 font-mono text-sm text-background shadow-2xl ">
      <div className="grid w-full max-w-lg items-center grid-cols-1">
        {/* create server action for submitting form data */}
        <form
          className="flex flex-col gap-4"
          action={sendGeneration}
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   setIsLoading(true); // Set the loading state to true

          //   const formData = new FormData();
          //   if (name) {
          //     formData.append("audioFile", name);
          //   }
          //   formData.append("position", position);

          //   fetcher(formData)
          //     .then((response) => {
          //       setIsLoading(false); // Set the loading state back to false
          //       // Handle the response
          //       const processedAudioFile = response.processedAudioFile;
          //       // Do something with the processed audio file
          //     })
          //     .catch((error) => {
          //       setIsLoading(false); // Set the loading state back to false
          //       // Handle the error
          //     });
          //   // startTransition(async () => {
          //   //   await fetcher(formData);
          //   // });
          // }}
        >
          <div>
            <p className="text-black">Seconds Remaining:</p>
          </div>

          <div>
            <Label htmlFor="picture" className="text-black">
              Upload your song
            </Label>{" "}
            <Input
              className="text-black border border-none rounded-half px-4 py-2 hover:bg-opacity-75 hover:bg-gray-300 hover:shadow"
              name="audio"
              accept="audio/*"
              required
              // value={name}
              type="file"
            />
            <Label htmlFor="picture" className="text-gray-500 text-xs">
              .wav or .mp3
            </Label>
          </div>

          {/* seconds dropdown */}
          <div>
            <DropdownMenuRadioGroupDemo
              position={position}
              setPosition={setPosition}
            />{" "}
          </div>

          {/* audio portion */}
          <div>
            <p></p>
            <audio
              id="song"
              className="w-full max-w-msd mx-auto"
              controls
              // src={song || "./testaudio"}
            >
              Your browser does not support the audio element.
            </audio>

            <p className="text-black">
              {/* {name ? " Successful upload, submit track below!" : ""} */}
            </p>
          </div>

          {/* generate button */}
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="btn text-black border border-black rounded-full px-4 py-2 hover:rainbow-shine"
              // disabled={isLoading} // Disable the button when loading
            >
              {/* {isLoading ? "Loading..." : "Make my music longer!"} */}
              make my music longer!
            </button>
          </div>
        </form>
        hello
        {/* // <LoginButton
            //   buttonText="Login with Google to Get Started"
            //   imageSrc="/images/google-logo.png"
            // />
          } */}
      </div>
    </div>
  );
}
