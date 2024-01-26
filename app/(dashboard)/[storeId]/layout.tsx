import Navbar from "@/components/Navbar";
import db from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}

export default async function DashboardLayout({
  children,
  params: { storeId },
}: LayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar stores={stores} />
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-2 sm:p-8 pt-6">{children}</div>
      </div>
    </>
  );
}
