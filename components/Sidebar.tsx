"use client";

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import to get current route
import React from "react";
import Logo from "./Logo";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";

const routes = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "/credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "/billing",
    label: "Billing",
    icon: CoinsIcon,
  },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableCreditsBadge />
      </div>
      <div className="flex flex-col p-2 gap-y-3">
        {" "}
        {/* Added gap-y-3 for more spacing */}
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={
              buttonVariants({
                variant:
                  pathname === route.href ? "sidebarActiveItem" : "sidebaritem",
              }) + " flex items-center space-x-2 p-3"
            } // Added p-3 for more spacing around items
          >
            {React.createElement(route.icon, { size: 20 })}
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
export function MobileSidebar() {
  const [isOpen, setOpen] = React.useState(false);
  const pathname = usePathname();

  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
  return (
    <div className="block border-seperate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-y-4"
            side={"left"}
          >
            <Logo />
            <UserAvailableCreditsBadge />
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={
                    buttonVariants({
                      variant:
                        pathname === route.href
                          ? "sidebarActiveItem"
                          : "sidebaritem",
                    }) + " flex items-center space-x-2 p-3"
                  } // Added p-3 for more spacing around items
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {React.createElement(route.icon, { size: 20 })}
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
