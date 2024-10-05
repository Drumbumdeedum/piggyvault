"use client";

import { signOutAction } from "@/lib/actions/auth.actions";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

const SidebarFooter = () => {
  const signout = async () => {
    await signOutAction();
  };
  return (
    <footer className="flex">
      <div className="flex-1">
        <Button onClick={signout} className="gap-2">
          <LogOut size="18" />
          Sign out
        </Button>
      </div>
    </footer>
  );
};

export default SidebarFooter;
