import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";

import LoginButton from "../components/LoginButton";
import Uploader from "../components/Uploader";

export const dynamic = "force-dynamic";

import { Stripe, loadStripe } from "@stripe/stripe-js";

// dummy data
// import { NextStripePricingTable } from "../lib/checkoutstripe";

// import {} from "../lib/checkoutstripe";

declare global {
  export namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": {
        "pricing-table-id": string;
        "publishable-key": string;
        "client-reference-id"?: string;
      };
    }
  }
}

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  // Get the user's session if there is one
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // // Load Stripe for the buy credits button
  // const stripe = await loadStripe(
  //   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  // );

  return (
    <div className="w-full flex flex-col items-center">
      {/* navigation */}

      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex  justify-between gap-5 items-center p-3 text-sm text-foreground">
          <p className="text-blue text-xs ml-2">
            You have <a className="font-bold underline">10 Credits</a>
          </p>

          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <p className="font-bold">
                  Welcome {user.email && user.email.split("@")[0]}!
                </p>
                <LogoutButton />
              </div>
            ) : (
              <LoginButton buttonText="Login" />
            )}
          </div>
        </div>
      </nav>

      {/* header */}
      <div className="animate-in flex flex-col items-center gap-3 opacity-0 max-w-4xl px-3 py-10 lg:py-14 text-foreground">
        <div className="flex flex-col items-center mb-2 lg:mb-4">
          <p className="btn2 font-bold text-6xl font-bold lg:text-6xl !leading-tight mx-auto max-w-xl text-center">
            Extend your music with generative AI
          </p>
          <p className="text-l lg:text-2xl !leading-tight mx-auto max-w-xl text-center mb-5 ">
            Upload your unique music piece, and let our system take care of the
            rest. Our platform can generate fresh and inspiring music that
            seamlessly continues your original work.
          </p>
        </div>

        {/* pass user  */}
        <Uploader userstat={user} />

        {/* resources */}

        {user && (
          <div className="flex items-center flex-col  max-w-xl gap-4 text-foreground">
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
            <h2 className="text-xl font-bold font-bold text-center">
              Your Files
            </h2>
            {/* render loading audio */}
            [file list]
          </div>
        )}

        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="flex flex-col !leading-tight mx-auto max-w-xl text-center text-foreground">
          <h2
            className="text-2xl font-bold underline text-center"
            style={{ color: "rgb(238, 193, 189)" }}
          >
            Pricing
          </h2>
          <p>
            100% Satisfaction guaranteed, if you are not happy with your
            generation, please{" "}
            <Link href="https://twitter.com/chanakyeah">contact us</Link> and we
            will try our best to help you.
          </p>
        </div>
        <div>
          <stripe-pricing-table
            pricing-table-id="prctbl_1NfLVnHwqkDf8yjhBWL8n3aI"
            publishable-key="pk_live_51HF1l0HwqkDf8yjhv3Bd6RIXHcMp1GlbYVdzKSQsKy81PiOKP9X2TVue3rG3mZXpfi5sC8uLM4wWtci9vM4EOoof00BmTCAPOj"
          ></stripe-pricing-table>
        </div>

        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

        {/* created by / credits */}
        <div className="flex flex-col justify-center text-center text-xs">
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
  );
}
