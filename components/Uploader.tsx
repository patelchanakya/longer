"use client";
import { Label } from "./ui/ui/label";
import { Input } from "./ui/ui/input";
import { useState, useTransition } from "react";
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
import { fetcher } from "../app/actions";
import LoginButton from "./LoginButton";

export default function Uploader({
  // onFileChange,
  userstat,
}: {
  // onFileChange: any;
  userstat: any;
}) {
  const [position, setPosition] = React.useState("20"); // state for dropdown menu
  const [name, changeName] = React.useState<File | null>(null);
  let [isPending, startTransition] = useTransition();

  const [song, setSong] = useState<string | undefined | null>(null);

  React.useEffect(() => {
    if (name instanceof Blob) {
      let reader = new FileReader();

      reader.onload = function () {
        // console.log(reader.result);
      };

      reader.onerror = function () {
        console.log(reader.error);
      };

      reader.readAsText(name);

      const objectUrl = URL.createObjectURL(name);
      console.log(objectUrl);
      setSong(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [name]); // Including name in the dependency array

  // if (file) {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   const formDataEntries = Array.from(formData.entries());
  //   for (let [key, value] of formDataEntries) {
  //     console.log("NOWWWW");
  //     console.log(key, value);
  //   }
  //   const response = await fetch("/api/upload", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   if (response.ok) {
  //     const newFileURL = await response.text();
  //     onFileChange(newFileURL);
  //   } else {
  //     console.error("File upload failed");
  //   }
  // }

  return (
    <div className="grid w-full max-w-md items-right bg-white py-6 px-8 rounded-2xl font-mono text-sm text-background  shadow-2xl">
      <div className="grid w-full max-w-sm items-center gap-3.5 grid-cols-1">
        {/* create server action for submitting form data */}
        {userstat ? (
          <form
            className="flex flex-col gap-4"
            action={fetcher}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              if (name) {
                formData.append("audioFile", name);
              }
              formData.append("position", position);

              // // Debugging: log the FormData values
              // for (let [key, value] of formData.entries()) {
              //   console.log(key, value);
              // }

              // Debugging: log the file name and position
              console.log("File:", name);
              console.log("Position:", position);

              startTransition(async () => {
                await fetcher(formData);
              });
            }}
          >
            <div>
              {userstat && (
                <p className="text-black">Seconds Remaining: 100 </p>
              )}
            </div>

            <div>
              <Label htmlFor="picture" className="text-black">
                Upload your song
              </Label>{" "}
              <Input
                className="text-black border border-none rounded-half px-4 py-2 hover:bg-opacity-75 hover:bg-gray-300 hover:shadow"
                id="audio"
                accept="audio/*"
                required
                // value={name}
                type="file"
                onChange={(e) => {
                  console.log(e.target.files?.[0]); // File object containing the selected file from the file system
                  changeName(e.target.files?.[0] || null);
                }}
              />
              <Label htmlFor="picture" className="text-gray-500 text-xs">
                .wav or .mp3
              </Label>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="hover:bg-opacity-75 hover:bg-gray-300 hover:shadow text-black">
                    {userstat
                      ? `+${position} seconds (${position} credits) ▼`
                      : "Please login to continue"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>How much longer?</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={setPosition}
                  >
                    <DropdownMenuRadioItem value="10">
                      +10 seconds
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="20">
                      +20 seconds
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="30">
                      +30 seconds
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <p></p>
              <audio
                id="song"
                className="w-full max-w-msd mx-auto"
                controls
                src={song || "./testaudio"}
              >
                Your browser does not support the audio element.
              </audio>

              <p className="text-black">
                {name ? " Successful upload, submit track below!" : ""}
              </p>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="btn text-black border border-black rounded-full px-4 py-2 hover:rainbow-shine"
              >
                Make my music longer!
              </button>
            </div>
          </form>
        ) : (
          <LoginButton
            buttonText="Login with Google to Get Started"
            imageSrc="/images/google-logo.png"
          />
        )}
      </div>
    </div>
  );
}
