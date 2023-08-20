"use client";

import * as React from "react";

import { Button } from "@/components/ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/ui/dropdown-menu";

type DropdownMenuRadioGroupDemoProps = {
  position: string;
  setPosition: any;
};

export function DropdownMenuRadioGroupDemo({
  position,
  setPosition,
}: DropdownMenuRadioGroupDemoProps) {
  console.log("position", position);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="hover:bg-opacity-75 hover:bg-gray-300 hover:shadow text-black">
          {/* {userstat
                        ? `+${position} seconds (${position} credits) ▼`
                        : "Please login to continue"} */}
          seconds ▼
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>How much longer?</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="10">+10 seconds</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="20">+20 seconds</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="30">+30 seconds</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
