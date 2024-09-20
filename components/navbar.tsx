"use client";

import { signOutAction } from "@/app/actions";

const Navbar = () => {
  const signout = async () => {
    await signOutAction();
  };
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <button onClick={signout}>Log out</button>
    </nav>
  );
};

export default Navbar;
