// SharedClient.tsx
"use server";

import Uploader from "./Uploader";
import FileList from "./FileList";
// import { fetcher } from "../app/actions";

type SharedClientProps = {
  userSession: any;
};

export async function SharedClient({ userSession }: SharedClientProps) {
  return (
    <div className="flex flex-col gap-4 ">
      {/* Other components */}
      <Uploader userstat={userSession} />
      <FileList />
    </div>
  );
}
