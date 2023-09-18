import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// post function is called when the user submits the button
// takes the request object as parameter
export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  // createRouteHandlerClient is a function that takes the cookies to create a supabase client using nextjs auth helpers
  const supabase = createRouteHandlerClient({ cookies });

  // calls the signInWithOAuth method with supabase.auth object specifying the google provider and options
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // queryParams: {
      //   access_type: 'offline',
      //   prompt: 'consent',
      //   // scope: 'https://www.googleapis.com/auth/business.manage',

      // },
      // redirect to the callback route after the user signs in
      // be sure to add in google console as a authorized redirect uri
      redirectTo: `https://660f-2607-fea8-4ee3-f100-cd4f-108d-f826-1aac.ngrok-free.app/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,

      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  // explain what this does
  return NextResponse.redirect(data.url, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
