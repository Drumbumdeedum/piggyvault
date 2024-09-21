"use client";

import { signOutAction } from "@/app/actions";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";

const SidebarFooter = () => {
  const signout = async () => {
    await signOutAction();
  };
  return (
    <footer className="flex">
      <div className="flex-1">
        <Button onClick={signout} className="gap-2">
          <div className="relative size-5">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 256 256"
              height="20px"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40A8,8,0,0,0,176,88v32H112a8,8,0,0,0,0,16h64v32a8,8,0,0,0,13.66,5.66l40-40A8,8,0,0,0,229.66,122.34Z"></path>
            </svg>
          </div>
          Sign out
        </Button>
      </div>
      <ThemeSwitcher />
    </footer>
  );
};

export default SidebarFooter;
