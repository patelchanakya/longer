"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { FileList } from "../components/FileList"
import DisplayFront from "@/components/DisplayFront";
import LoginButton from "../components/LoginButton";
import NextStripePricingTable from "./checkoutstripe/page";
import { SharedClient } from "../components/SharedClient";
import FileSingle from "@/components/FileSingle";

const pricingTableId = process.env.NEXT_PUBLIC_PRICING_TABLE_ID as string;
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;

let genFilesDisplay: any;


export default async function Index() {
  const supabase = createServerComponentClient({ cookies });
  // Get the user's session if there is one
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('mas_generations')
    .select('gen_file, audio_file'); // Include the audio_file in the select statement
  console.log(data); // Add this line
  let fileList = data || [];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error("Please define the NEXT_PUBLIC_BASE_URL environment variable");
  }

  return (
    <div className="w-full justify-center flex flex-col items-center gap-7">
      {/* navigation */}
      {user && (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-12">
          <div className="w-full max-w-4xl flex justify-between items-center p-4 text-sm text-foreground">
            {/* Welcome text */}
            {user && (
              <p className="font-normal" style={{ color: "darkslategray" }}>
                Welcome {user.email && user.email.split("@")[0]}!
              </p>
            )}

            {/* Login/Logout button */}
            <div className="flex items-center">
              {user ? (
                <>
                  <LogoutButton />
                </>
              ) : (
                <div><LoginButton buttonText="Login" /></div>

              )}
            </div>
          </div>
        </nav>)}
      {/* header */}
      <div className="w-full animate-in flex flex-col items-center gap-3 opacity-0 max-w-4xl px-3 py-10 lg:py-14 text-foreground">
        <div className="flex flex-col items-center mb-2 lg:mb-4">
          <p className="btn2 font-bold text-6xl font-bold lg:text-6xl !leading-tight mx-auto max-w-xl text-center">
            Extend your music with generative AI
          </p>
          <p className="text-xl lg:text-xl !leading-tight mx-auto max-w-xl text-center mb-5 ">
            Upload your unique music piece, and let our system take care of the
            rest. Our platform can generate fresh and inspiring music that
            seamlessly continues your original work.
          </p>
        </div>

        {/* resources */}
        <div className="flex flex-col w-3/4 text-foreground">
          {user ? (

            <SharedClient userSession={user} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-80 h-auto">
                <LoginButton imageSrc="/images/google-logo.png" />
              </div>

            </div>
          )}</div>

        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />




        {/* Pricing */}
        <div className="flex flex-col !leading-tight mx-auto mt-[5px] max-w-xl text-center text-foreground">

          {!user && (
            <div className="flex flex-col !leading-tight mx-auto mt-[5px] max-w-xl text-center text-foreground">
              <h2 className="text-2xl font-bold mb-4">
                Some Examples
              </h2>

              {fileList && fileList.map((file: any) => (
                <div className="flex flex-col lg:flex-row justify-center items-center gap-1 lg:gap-8 mb-4">
                  <div className="w-full lg:w-auto flex flex-col items-center">
                    <h3 className="text-xs lg:text-sm font-semibold text-gray-500">Original Piece</h3>
                    <DisplayFront files={[file.audio_file]} />
                  </div>
                  <div className="w-full lg:w-auto flex flex-col items-center">
                    <h3 className="text-xs lg:text-sm font-semibold text-gray-500">Generated Extension</h3>
                    <DisplayFront files={[file.gen_file]} />
                  </div>
                </div>
              ))}
            </div>
          )}



          {user && user.email && (
            <h2
              className="text-l
               underline text-center"
            // style={{ color: "darkslategray" }}
            >
              Buy more seconds
            </h2>
          )}

          <p>
            100% Satisfaction guaranteed, if you are not happy with your
            generation, please{" "}
            <Link
              href="https://twitter.com/chanakyeah"
              style={{ color: "rgb(238, 193, 189)" }}
            >
              <u>contact us</u>{" "}
            </Link>
            and we will try our best to help you.
          </p>
        </div>

        <div>


          {user && user.email && (
            <NextStripePricingTable
              clientReferenceId={user.id}
              customerEmail={user.email}
            />
          )}
        </div>

        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

        {/* created by / credits */}

        <div className="flex flex-col justify-center items-center text-center text-xs mt-auto">
          <div className="flex flex-col justify-center">
            <p>
              Created by{" "}
              <Link
                href="https://twitter.com/chanakyeah"
                target="_blank"
                className="font-bold"
              >
                @chanakyeah
              </Link>
            </p>
            <p>
              Powered by{" "}
              <Link
                href="https://arxiv.org/abs/2306.05284"
                target="_blank"
                className="font-bold"
              >
                FacebookResearch
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div >
  );
}
