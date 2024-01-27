"use client";
import { useParams } from "next/navigation";

import { DataTable } from "@/components/ui/DataTable";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import { ApiList } from "@/components/ui/ApiList";

import { columns, BillboardColumn } from "./columns";
import DashboardHeading from "@/components/DashboardHeading";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams();

  return (
    <>
      <DashboardHeading
        title={`Билборды (${data.length})`}
        description="Управляйте билбордами в своем магазине"
        redirectTo={`/${params.storeId}/billboards/new`}
      />
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="API для билбордов" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};
