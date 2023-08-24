"use client";

import { Label } from "./ui/ui/label";
import { Input } from "./ui/ui/input";
import * as React from "react";
import { sendGeneration } from "../app/actions";
import { Slider } from "@/components/ui/ui/slider"



export default function Uploader({ userCredits }: any) {

  const currCreds = userCredits && userCredits[0].credit_amount;
  const [position, setPosition] = React.useState("20");
  const [sliderValue, setSliderValue] = React.useState(10); // Initial slider value
  const [isHovered, setIsHovered] = React.useState(false);



  // const handleSliderChange = (value: any) => {
  //   setSliderValue(value);
  // };

  // const handleSliderChange = (event: React.FormEvent<HTMLDivElement>) => {
  //   const value = Number((event.target as HTMLInputElement).value);
  //   setSliderValue(value);
  //   console.log('slider value', value);
  // };
  // React.useEffect(() => {
  //   const handleSliderChange = (event: React.FormEvent<HTMLDivElement>) => {
  //     const value = Number((event.target as HTMLInputElement).value);
  //     setSliderValue(value);
  //   };
  // }, [sliderValue]);

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
                </Label>
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

              <div className="flex flex-col gap-2 w-full h-full justify-center px-10 text-black border-black ">
                <Slider defaultValue={[sliderValue]} min={1} max={30} step={1} onValueChange={(value) => {
                  console.log('Slider Value:', value[0]); // Log the value here
                  setSliderValue(value[0]);
                }} />
                <div className="flex flex-row gap-1 pl-0.5 items-center">
                  <p className="text-black">Track Length: {sliderValue}s</p>
                  <span
                    className="inline-block relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <img className="manImg" src="/images/question.png" alt="Question" />
                    {isHovered && (
                      <span
                        className="absolute break-word z-[10] block top-0 ml-4 pl-2 py-1 px-1 text-xs text-white bg-black rounded whitespace-normal w-[100px] sm:w-[355px] md:w-[453px]"

                      >
                        Adjust the duration of how many seconds to extend your track.
                      </span>
                    )}
                  </span>
                </div>
              </div>


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
