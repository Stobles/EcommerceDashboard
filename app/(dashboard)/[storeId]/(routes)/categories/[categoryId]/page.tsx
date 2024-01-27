import prismadb from "@/lib/prismadb";

import { CategoryForm } from "./components/CategoryForm";
import db from "@/lib/prismadb";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return <CategoryForm initialData={category} billboards={billboards} />;
};

export default CategoryPage;
