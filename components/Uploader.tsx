"use client";

import { Label } from "./ui/ui/label";
import { Input } from "./ui/ui/input";
import * as React from "react";
import { sendGeneration } from "../app/actions";
import { DropdownMenuRadioGroupDemo } from "./RadioGroup";


export default function Uploader({ userCredits }: any) {

  const currCreds = userCredits && userCredits[0].credit_amount;
  const [position, setPosition] = React.useState("20");

  return (
    <div className="w-auto items-center bg-white py-8 px-4 font-mono text-sm text-background shadow-2xl ">
      <div className="max-w-2xl mx-auto"> {/* Add mx-auto class to center the div */}
        <div className="w-full max-w-2xl items-center grid-cols-1"> {/* create server action for submitting form data */}
          {userCredits && (
            <form
              className="w-full form-container gap-4"
              action={sendGeneration}
            >
              <div className="w-full"> {currCreds ? <p className="text-black">Seconds Remaining: {currCreds}</p> : <p className="text-black">lTry your first generation for free!</p>}

              </div>

              <div className="w-full">
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
                />
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
          )}



        </div>
      </div>
    </div >
  );
}
