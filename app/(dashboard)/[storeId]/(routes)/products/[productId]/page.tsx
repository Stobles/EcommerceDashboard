import db from "@/lib/prismadb";

import { ProductForm } from "./components/ProductForm";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await db.product.findUnique({
    include: {
      images: true,
    },
    where: {
      id: params.productId,
    },
  });

  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <ProductForm
      categories={categories}
      colors={colors}
      sizes={sizes}
      initialData={product}
    />
  );
};

export default ProductPage;
