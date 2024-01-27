"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import { ApiList } from "@/components/ui/ApiList";

import { columns, SizeColumn } from "./columns";
import DashboardHeading from "@/components/DashboardHeading";

interface SizesClientProps {
  data: SizeColumn[];
}

export const SizesClient: React.FC<SizesClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <DashboardHeading
        title={`Размеры (${data.length})`}
        description="Управляйте размерами в своем магазине"
        redirectTo={`/${params.storeId}/sizes/new`}
      />
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API для размеров" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};
