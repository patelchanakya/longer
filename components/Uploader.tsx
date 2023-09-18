"use client";
import { Label } from "./ui/ui/label";
import { Input } from "./ui/ui/input";
import * as React from "react";
import { Slider } from "@/components/ui/ui/slider";
import { useRouter } from "next/navigation";
export const runtime = "edge"; // 'nodejs' is the default

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Loading from "./Loading";

// refresth the page after api replicate resp
export const dynamic = "force-dynamic";

export default function Uploader({
  userSession,
  channel,
}: {
  userSession: any;
  channel: any;
}) {
  console.log(userSession);

  const [sliderValue, setSliderValue] = React.useState(10); // Initial slider value
  const [isHovered, setIsHovered] = React.useState(false);
  const [song, setSong] = React.useState<File | undefined>(undefined);
  const [audioSrc, setAudioSrc] = React.useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = React.useState(false); // Add isLoading state

  const supabase = createClientComponentClient({});

  const [userCredits, setUserCredits] = React.useState<number | undefined>(
    undefined
  );

  const router = useRouter();

  const fetchUserCredits = async () => {
    try {
      const { data: user_credits, error } = await supabase
        .from("user_credits")
        .select("credit_amount")
        .eq("user_id", userSession.id);

      if (error) {
        console.error("Error fetching user credits:", error);
        return;
      }

      if (user_credits && user_credits.length > 0) {
        console.log("User credits:", user_credits[0].credit_amount);
        setUserCredits(user_credits[0].credit_amount); // Set the userCredits state to the credit_amount value before subtracting the slider value in the actions.ts file
        router.refresh(); // this is not working
      } else {
        console.log("No credits found for this user.");
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
    }
  };

  const getInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist(); // Remove the event from the pool
    const file = e.target.files ? e.target.files[0] : undefined;
    setSong(file);
    const src = file ? URL.createObjectURL(file) : undefined;
    setAudioSrc(src);
  };

  const handleFormSubmission = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsLoading(true); // Start loading

    const formData = new FormData();
    formData.append("audio", song as Blob);
    formData.append("slider", sliderValue.toString());

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Handle the response data here
      setIsLoading(false); // End loading
      router.refresh();

      console.log("File uploaded:", data);
      // Update the userCredits state with the updated credits from the response
      setUserCredits(data.updatedCredits);
    } catch (error) {
      // Handle the error here
      console.error("Error uploading file:", error);
    }
  };

  // handle updated record , updating state
  const handleRecordUpdated = (payload: any) => {
    if (payload.record.user_id === userSession.id) {
      setUserCredits(payload.record.credit_amount);
    }
  };

  React.useEffect(() => {
    // fetch initial user credits
    fetchUserCredits();

    console.log("Setting up Realtime subscription...");

    console.log("Channel created:", channel);

    const subscription = channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_credits",
          filter: `user_id=eq.${userSession.id}`,
        },
        (payload: { record: any }) => {
          console.log("Payload:", payload); // Log the entire payload
          if (payload && payload.record) {
            handleRecordUpdated(payload.record);
          }
        }
      )
      .subscribe();

    console.log("Realtime subscription set up.");

    // Unsubscribe when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="w-auto items-center bg-white py-8 px-8 font-mono text-sm text-background shadow-2xl ">
      {" "}
      <div className="max-w-2xl mx-auto">
        {" "}
        {/* Add mx-auto class to center the div */}
        <div className="w-full max-w-2xl items-center grid-cols-1">
          {" "}
          {/* create server action for submitting form data */}
          <p className="text-black py-1">
            Seconds remaining{" "}
            <b>
              <u>{userCredits}s</u>
            </b>
          </p>
          {userSession && (
            <form
              className="w-full form-container gap-4"
              onSubmit={handleFormSubmission}
              method="POST"
              encType="multipart/form-data"
            >
              <div className="w-full">
                <Label htmlFor="picture" className="text-black">
                  Upload your song
                </Label>
                <Input
                  className="text-black border border-none rounded-half px-4 py-2 hover:bg-opacity-75 hover:bg-gray-300 hover:shadow"
                  name="audio"
                  accept="audio/*"
                  required
                  type="file"
                  onChange={getInput}
                />
                <Label htmlFor="picture" className="text-gray-500 text-xs">
                  .wav or .mp3
                </Label>
              </div>

              <div className="flex flex-col gap-2 w-full h-full justify-center px-10 text-black border-black ">
                <Slider
                  name="slider"
                  defaultValue={[sliderValue]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(value: React.SetStateAction<number>[]) => {
                    console.log("Slider Value:", value[0]); // Log the value here
                    setSliderValue(value[0]);
                  }}
                />
                <div className="flex flex-row gap-1 pl-0.5 items-center">
                  <p className="text-black">Track Length: {sliderValue}s</p>
                  <span
                    className="inline-block relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <img
                      className="manImg"
                      src="/images/question.png"
                      alt="Question"
                    />
                    {isHovered && (
                      <span className="absolute break-word z-[10] block top-0 ml-4 pl-2 py-1 px-1 text-xs text-white bg-black rounded whitespace-normal w-[100px] sm:w-[355px] md:w-[453px]">
                        Adjust the duration of how many seconds to extend your
                        track.
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
                  src={audioSrc}
                >
                  Your browser does not support the audio element.
                </audio>

                <p className="text-black">
                  {/* {name ? " Successful upload, submit track below!" : ""} */}
                </p>
              </div>

              {/* generate button */}
              <div className="btn text-black border border-black rounded-full px-4 py-2 hover:rainbow-shine">
                {isLoading ? (
                  <Loading />
                ) : (
                  <button type="submit" className="btn-primary">
                    Generate
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
