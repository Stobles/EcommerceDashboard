import { format } from "date-fns";

import db from "@/lib/prismadb";

import { SizeColumn } from "./components/columns";
import { SizesClient } from "./components/Client";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await db.size.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      storeId: params.storeId,
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    id: item.id,
    name: item.name,
    value: item.value,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
