"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();
  const routes = [
    {
      active: pathname === `/${params.storeId}`,
      href: `/${params.storeId}`,
      label: "Главная",
    },
    {
      active: pathname === `/${params.storeId}/billboards`,
      href: `/${params.storeId}/billboards`,
      label: "Билборды",
    },
    {
      active: pathname === `/${params.storeId}/categories`,
      href: `/${params.storeId}/categories`,
      label: "Категории",
    },
    {
      active: pathname === `/${params.storeId}/sizes`,
      href: `/${params.storeId}/sizes`,
      label: "Размеры",
    },
    {
      active: pathname === `/${params.storeId}/colors`,
      href: `/${params.storeId}/colors`,
      label: "Цвета",
    },
    {
      active: pathname === `/${params.storeId}/products`,
      href: `/${params.storeId}/products`,
      label: "Товары",
    },
    {
      active: pathname === `/${params.storeId}/orders`,
      href: `/${params.storeId}/orders`,
      label: "Заказы",
    },
    {
      active: pathname === `/${params.storeId}/settings`,
      href: `/${params.storeId}/settings`,
      label: "Настройки",
    },
  ];
  return (
    <nav className={cn(className, "space-x-4 lg:space-x-6")}>
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
