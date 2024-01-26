import { format } from "date-fns";

import db from "@/lib/prismadb";

import { ColorColumn } from "./components/columns";
import { ColorsClient } from "./components/Client";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await db.color.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      storeId: params.storeId,
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    id: item.id,
    name: item.name,
    value: item.value,
  }));

  return <ColorsClient data={formattedColors} />;
};

export default ColorsPage;
