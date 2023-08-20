"use server";

import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// export async function fetcher(formData: FormData) {
//   try {
//     // Assign the audioFile and position values to variables

//   }
// }

export const sendGeneration = async (formData: FormData) => {
  "use server";
  console.log("console-------", formData);
  // const title = formData.get("");
  const supabase = createServerActionClient({ cookies });
  // Get the user's session if there is one
  const {
    data: { user },
  } = await supabase.auth.getUser();
};
