"use client";

import { signOutAction } from "@/lib/actions/auth.actions";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "../core/ThemeSwitcher";

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
      <ThemeSwitcher />
    </footer>
  );
};

export default SidebarFooter;
