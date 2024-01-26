import db from "@/lib/prismadb";

import { BillboardForm } from "./components/BillboardForm";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await db.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return <BillboardForm initialData={billboard} />;
};

export default BillboardPage;
