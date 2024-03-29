"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./CellAction";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  amount: string;
  category: string;
  size: string;
  color: string;
  createdAt: string;
  isFeatured: string;
  isArchived: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "isArchived",
    header: "Состояние",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Цена",
  },
  {
    accessorKey: "amount",
    header: "Количество",
  },
  {
    accessorKey: "category",
    header: "Категория",
  },
  {
    accessorKey: "size",
    header: "Размер",
  },
  {
    accessorKey: "color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
    header: "Цвет",
  },
  {
    accessorKey: "createdAt",
    header: "Дата создания",
  },
  {
    cell: ({ row }) => <CellAction data={row.original} />,
    id: "actions",
  },
];
