"use client";

import SidebarFooter from "./SidebarFooter";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathName = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r pt-8 max-md:hidden sm:p-4 xl:p-6 2xl:w-[355px]">
      <nav className="flex flex-col gap-4">
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
                <div
                  className="relative size-5"
                  dangerouslySetInnerHTML={{ __html: sidebarLink.icon }}
                />
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
