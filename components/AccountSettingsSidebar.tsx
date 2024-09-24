"use client";

import { accountSettingsSidebarLinks } from "@/constants/sidebarLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const AccountSettingsSidebar = () => {
  const pathName: string = usePathname();
  return (
    <div className="w-64 pr-4">
      {accountSettingsSidebarLinks.map((link, index) => {
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
              <p>{link.label}</p>
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default AccountSettingsSidebar;
