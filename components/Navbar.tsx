import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import db from "@/lib/prismadb";
import { UserButton, auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";
import { ThemeToggle } from "./ui/ThemeToggle";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <header className="border-b ">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6 hidden md:flex" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
