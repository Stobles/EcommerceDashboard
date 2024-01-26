import { format } from "date-fns";

import db from "@/lib/prismadb";

import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/Client";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await db.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      storeId: params.storeId,
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    address: item.address,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    id: item.id,
    isPaid: item.isPaid,
    phone: item.phone,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
  }));

  return <OrderClient data={formattedOrders} />;
};

export default OrdersPage;
