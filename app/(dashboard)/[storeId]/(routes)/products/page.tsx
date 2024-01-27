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
    isArchived: item.isArchived ? "Спрятан" : "Не спрятан",
    isFeatured: item.isFeatured ? "Featured" : "Not Featured",
    name: item.name,
    price: formatter.format(item.price.toNumber()),
    size: item.size.name,
  }));

  return <ProductsClient data={formattedProducts} />;
};

export default ProductsPage;
