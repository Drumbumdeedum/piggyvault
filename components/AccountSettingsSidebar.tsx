"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

import { CircleUser, LinkIcon } from "lucide-react";

export const sidebarLinks = [
  {
    route: "account-settings",
    label: "Account settings",
    icon: <CircleUser size="18" />,
  },
  {
    route: "linked-accounts",
    label: "Linked accounts",
    icon: <LinkIcon size="18" />,
  },
];

const AccountSettingsSidebar = () => {
  const pathName: string = usePathname();
  return (
    <div className="flex flex-col">
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
    </div>
  );
};

export default AccountSettingsSidebar;
