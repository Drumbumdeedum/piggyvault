"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

import { KeyRound, CircleUser } from "lucide-react";

export const sidebarLinks = [
  {
    route: "personal-data",
    label: "Personal",
    icon: <CircleUser size="18" />,
  },
  {
    route: "login-details",
    label: "Login details",
    icon: <KeyRound size="18" />,
  },
];

const AccountSettingsSidebar = () => {
  const pathName: string = usePathname();
  return (
    <div className="pr-5 min-w-56 flex flex-col gap-3">
      {sidebarLinks.map((link, index) => {
        const path: string = pathName.split("/").pop()!;
        const isActive =
          path === link.route ||
          (link.route !== "/" && path.startsWith(`${link.route}`));
        return (
          <Link key={index} href={link.route}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start items-center gap-2"
            >
              <div>{link.icon}</div>
              <p>{link.label}</p>
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default AccountSettingsSidebar;
