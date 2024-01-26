"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Route } from "./Navbar";

const MainNav = ({
  className,
  routes,
  ...props
}: React.HTMLAttributes<HTMLElement> & { routes: Route[] }) => {
  return (
    <nav className={cn(className, "space-x-6")}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
