import db from "@/lib/prismadb";

import { ColorForm } from "./components/ColorForm";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const color = await db.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return <ColorForm initialData={color} />;
};

export default ColorPage;
