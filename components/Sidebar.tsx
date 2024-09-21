"use client";

import SidebarFooter from "./SidebarFooter";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const Sidebar = () => {
  const pathName = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-gray-200 bg-white pt-8 text-white max-md:hidden sm:p-4 xl:p-6 2xl:w-[355px]">
      <nav className="flex flex-col gap-4">
        {sidebarLinks.map((sidebarLink) => {
          const isActive =
            pathName === sidebarLink.route ||
            (sidebarLink.route !== "/" &&
              pathName.startsWith(`${sidebarLink.route}`));
          return (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link key={sidebarLink.label} href={sidebarLink.route}>
                <p className="text-foreground">{sidebarLink.label}</p>
              </Link>
            </Button>
          );
        })}
      </nav>
      <SidebarFooter />
    </section>
  );
};

export default Sidebar;
