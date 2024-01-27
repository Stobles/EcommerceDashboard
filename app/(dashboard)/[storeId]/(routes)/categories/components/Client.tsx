"use client";

import { useParams, useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/DataTable";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import { ApiList } from "@/components/ui/ApiList";

import { columns, CategoriesColumn } from "./columns";
import DashboardHeading from "@/components/DashboardHeading";

interface CategoriesClientProps {
  data: CategoriesColumn[];
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <DashboardHeading
        title={`Категории (${data.length})`}
        description="Управляйте категориями в своем магазине"
        redirectTo={`/${params.storeId}/categories/new`}
      />
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="Api для категорий" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};
