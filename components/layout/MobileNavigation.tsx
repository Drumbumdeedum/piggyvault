"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "./Sidebar";
import { Button } from "../ui/button";
import { Menu, PiggyBank } from "lucide-react";
import { ThemeSwitcher } from "../core/ThemeSwitcher";

const MobileNavigation = () => {
  const pathName = usePathname();
  return (
    <section className="w-full max-w-[264px] flex justify-end">
      <Sheet>
        <SheetTrigger>
          <Menu size="30" />
        </SheetTrigger>
        <SheetContent side="left" className="border-none">
          <SheetHeader>
            <SheetTitle>
              <Link
                className="cursor-pointer items-center gap-1 flex px-4"
                href="/"
              >
                <PiggyBank size="36" className="mr-2" />
                <h2 className="font-bold text-2xl">Piggyvault</h2>
              </Link>
            </SheetTitle>
            <SheetDescription aria-describedby="Mobile navigation sidebar" />
          </SheetHeader>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <>
                <nav className="flex h-full flex-col gap-3 pt-6">
                  {sidebarLinks.map((sidebarLink) => {
                    const isActive =
                      pathName === sidebarLink.base ||
                      (sidebarLink.base !== "/" &&
                        pathName.startsWith(`${sidebarLink.base}`));
                    return (
                      <SheetClose key={sidebarLink.label} asChild>
                        <Link key={sidebarLink.label} href={sidebarLink.route}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start items-center gap-2"
                          >
                            <div>{sidebarLink.icon}</div>
                            <p>{sidebarLink.label}</p>
                          </Button>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
                <footer>
                  <ThemeSwitcher />
                </footer>
              </>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};
export default MobileNavigation;
