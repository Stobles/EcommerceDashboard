import db from "@/lib/prismadb";

import { SizeForm } from "./components/SizeForm";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const size = await db.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return <SizeForm initialData={size} />;
};

export default SizePage;
