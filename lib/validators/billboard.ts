import { z } from "zod";

export const BillboardValidator = z.object({
  imageUrl: z.string().min(2, "Строка должна содержать 2 и более символов."),
  label: z.string().min(2, "Строка должна содержать 2 и более символов."),
});

export type BillboardRequest = z.infer<typeof BillboardValidator>;
