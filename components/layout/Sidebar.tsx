"use client";

import SidebarFooter from "./SidebarFooter";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { House, ArrowRightLeft, Settings, Wallet } from "lucide-react";
import { Button } from "../ui/button";

const sidebarLinks = [
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
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r pt-8 max-md:hidden sm:p-4 xl:p-6 xl:w-[18rem]">
      <nav className="flex flex-col gap-3">
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
