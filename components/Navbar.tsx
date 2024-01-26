"use client";

import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import { UserButton, auth } from "@clerk/nextjs";

import { ThemeToggle } from "./ui/ThemeToggle";
import { Menu } from "lucide-react";
import { Sidebar } from "./ui/Sidebar";
import { useMediaQuery } from "react-responsive";
import { Store } from "@prisma/client";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type Route = {
  active: boolean;
  href: string;
  label: string;
};

const Navbar = ({ stores }: { stores: Store[] }) => {
  const pathname = usePathname();
  const params = useParams();
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  const [showOnSmallScreen, setShowOnSmallScreen] = useState(false);
  useEffect(() => {
    setShowOnSmallScreen(isTablet);
  }, [isTablet]);

  const routes: Route[] = [
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
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-2">
        {showOnSmallScreen && (
          <Sidebar>
            <Sidebar.Trigger>
              <Menu />
            </Sidebar.Trigger>
            <Sidebar.Root>
              <Sidebar.Header className="justify-between items-center">
                <h2>Dashboard</h2>
                <Sidebar.Trigger>
                  <Menu />
                </Sidebar.Trigger>
              </Sidebar.Header>
              <Sidebar.Content>
                {routes.map((route) => (
                  <Sidebar.Item
                    key={route.label}
                    href={route.href}
                    isActive={route.active}
                  >
                    {route.label}
                  </Sidebar.Item>
                ))}
              </Sidebar.Content>
            </Sidebar.Root>
          </Sidebar>
        )}
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6 hidden lg:flex" routes={routes} />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
