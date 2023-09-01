'use client'
import Uploader from "./Uploader";
import { createClientComponentClient, User } from "@supabase/auth-helpers-nextjs";


import { FileList } from "../components/FileList";
import { useState, useEffect } from "react";

type SharedClientProps = {
  userSession: User;
};

export function SharedClient({ userSession }: SharedClientProps) {
  const supabase = createClientComponentClient();
  const [channel, setChannel] = useState(null);


  useEffect(() => {
    const channel = supabase.channel('realtime-longer') as any;
    setChannel(channel);
  }, []);

  if (!channel) {
    return null; // or some loading state
  }

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Other components */}
      <Uploader userSession={userSession} channel={channel} />
      {/* <FileList /> */}
      {/* files */}
      <div className="w-full p-[1px] pt-[5px] mt-[5px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      <h2 className="text-xl font-bold font-bold text-center" >
        My Files
      </h2>
      <FileList userSession={userSession} />
    </div>
  );
}
