"use client";

import SidebarFooter from "./SidebarFooter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

import {
  House,
  ArrowRightLeft,
  Link as LinkIcon,
  Settings,
} from "lucide-react";

const sidebarLinks = [
  {
    route: "/",
    label: "Home",
    icon: <House size="18" />,
  },
  {
    route: "/transactions",
    label: "Transactions",
    icon: <ArrowRightLeft size="18" />,
  },
  {
    route: "/linked-accounts",
    label: "Linked accounts",
    icon: <LinkIcon size="18" />,
  },
  {
    route: "/account",
    label: "Account",
    icon: <Settings size="18" />,
  },
];

const Sidebar = () => {
  const pathName = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r pt-8 max-md:hidden sm:p-4 xl:p-6 xl:w-[355px]">
      <nav className="flex flex-col gap-3">
        {sidebarLinks.map((sidebarLink) => {
          const isActive =
            pathName === sidebarLink.route ||
            (sidebarLink.route !== "/" &&
              pathName.startsWith(`${sidebarLink.route}`));
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
