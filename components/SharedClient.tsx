
import Uploader from "./Uploader";
import FileList from "./FileList";
import { User, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
// import { fetcher } from "../app/actions";


type SharedClientProps = {
  userSession: User;
};



export async function SharedClient({ userSession }: SharedClientProps) {
  "use server";
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`, { /* your request options */ });
  // const responseText = await response.();
  // console.log('Response text:', responseText);


  let data;
  try {
    // data = JSON.parse(responseText);
  } catch (err) {
    console.error('Error parsing response:', err);
    data = null;
  }
  console.log('rathy', data);

  // if (data && data.paymentSuccessful) {
  //   // Use the router to redirect the user
  //   const router = useRouter();
  //   router.push('/');
  // }

  const supabase = createServerComponentClient({ cookies });
  const userId = userSession.id
  console.log('---->', userId)

  let { data: user_credits, error }: any = await supabase
    .from('user_credits')
    .select('credit_amount')
    .eq('user_id', userId)

  return (
    <div className="flex flex-col w-full gap-4 ">
      {/* Other components */}
      <Uploader userCredits={user_credits} />
      <FileList />
    </div>
  );
}
