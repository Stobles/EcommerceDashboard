import { format } from "date-fns";

import db from "@/lib/prismadb";

import { CategoriesColumn } from "./components/columns";
import { CategoriesClient } from "./components/Client";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await db.category.findMany({
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      storeId: params.storeId,
    },
  });

  const formattedCategories: CategoriesColumn[] = categories.map((item) => ({
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    id: item.id,
    name: item.name,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
