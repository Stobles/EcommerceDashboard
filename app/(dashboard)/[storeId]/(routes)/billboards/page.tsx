import { format } from "date-fns";

import db from "@/lib/prismadb";

import { BillboardColumn } from "./components/columns";
import { BillboardClient } from "./components/Client";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await db.billboard.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      storeId: params.storeId,
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    id: item.id,
    label: item.label,
  }));

  return <BillboardClient data={formattedBillboards} />;
};

export default BillboardsPage;
