"use client";

import { DataTable } from "@/components/ui/DataTable";
import { Separator } from "@/components/ui/Separator";

import { columns, OrderColumn } from "./columns";
import DashboardHeading from "@/components/DashboardHeading";
import { FC } from "react";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <DashboardHeading
        title={`Заказы (${data.length})`}
        description="Управляйте заказами в своем магазине"
        isEdit={false}
      />
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
    </>
  );
};
