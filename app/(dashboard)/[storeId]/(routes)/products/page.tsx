import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/Client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    include: {
      category: true,
      color: true,
      size: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      storeId: params.storeId,
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    amount: item.amount.toString(),
    category: item.category.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    id: item.id,
    isArchived: item.isArchived ? "Archived" : "Not Archived",
    isFeatured: item.isFeatured ? "Featured" : "Not Featured",
    name: item.name,
    price: formatter.format(item.price.toNumber()),
    size: item.size.name,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
