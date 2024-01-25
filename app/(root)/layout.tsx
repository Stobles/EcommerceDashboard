import db from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children } : LayoutProps) => {
  const { userId } = auth();

  if(!userId) {
    redirect('/sign-in')
  }

  const store = await db.store.findFirst({
    where: {
      userId,
    }
  })

  if(store) {
    redirect(`/${store.id}`)
  }

  return (
    <>
      {children}
    </>
  )
};

export default Layout;
