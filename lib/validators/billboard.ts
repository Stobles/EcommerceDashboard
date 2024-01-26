import { z } from "zod";

export const BillboardValidator = z.object({
  imageUrl: z.string().min(1, "Билборд должен содержать изображение."),
  label: z.string().min(2, "Строка должна содержать 2 и более символов."),
});

export type BillboardRequest = z.infer<typeof BillboardValidator>;
