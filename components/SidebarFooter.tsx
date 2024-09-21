"use client";

import { signOutAction } from "@/app/actions";
import React from "react";
import { Button } from "./ui/button";

const SidebarFooter = () => {
  const signout = async () => {
    await signOutAction();
  };
  return (
    <footer className="flex cursor-pointer items-center justify-between gap-2 py-6">
      <p className="text-foreground">User name</p>
      <Button onClick={signout}>Sign out</Button>
    </footer>
  );
};

export default SidebarFooter;
