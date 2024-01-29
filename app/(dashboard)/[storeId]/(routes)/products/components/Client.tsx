"use client";

import { useParams, useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/DataTable";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import { ApiList } from "@/components/ui/ApiList";

import { ProductColumn, columns } from "./columns";
import DashboardHeading from "@/components/DashboardHeading";

interface ProductsClientProps {
  data: ProductColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
  const params = useParams();

  return (
    <>
      <DashboardHeading
        title={`Товары (${data.length})`}
        description="Управляйте товарами в своем магазине"
        redirectTo={`/${params.storeId}/products/new`}
      />
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API для товаров" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
