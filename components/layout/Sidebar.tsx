"use client";

import SidebarFooter from "./SidebarFooter";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  House,
  ArrowRightLeft,
  Settings,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { Button } from "../ui/button";

export const sidebarLinks = [
  {
    base: "/",
    route: "/",
    label: "Home",
    icon: <House size="18" />,
  },
  {
    base: "/transactions",
    route: "/transactions",
    label: "Transactions",
    icon: <ArrowRightLeft size="18" />,
  },
  {
    base: "/accounts",
    route: "/accounts",
    label: "Accounts",
    icon: <Wallet size="18" />,
  },
  {
    base: "/account-settings",
    route: "/account-settings",
    label: "Settings",
    icon: <Settings size="18" />,
  },
];

const Sidebar = () => {
  const pathName = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col gap-6 border-r pt-8 max-md:hidden sm:p-4 xl:p-6 xl:w-[18rem]">
      <div className="cursor-pointer items-center gap-1 flex px-4">
        <PiggyBank size="36" className="mr-2" />
        <h2 className="font-bold text-2xl">Piggyvault</h2>
      </div>
      <nav className="flex flex-col flex-1 gap-3">
        {sidebarLinks.map((sidebarLink) => {
          const isActive =
            pathName === sidebarLink.base ||
            (sidebarLink.base !== "/" &&
              pathName.startsWith(`${sidebarLink.base}`));
          return (
            <Link key={sidebarLink.label} href={sidebarLink.route}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start items-center gap-2"
              >
                <div>{sidebarLink.icon}</div>
                <p>{sidebarLink.label}</p>
              </Button>
            </Link>
          );
        })}
      </nav>
      <SidebarFooter />
    </section>
  );
};

export default Sidebar;
