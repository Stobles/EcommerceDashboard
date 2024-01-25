import { z } from "zod";

export const CategoryValidator = z.object({
  billboardId: z.string().min(2, "Строка должна содержать 2 и более символов."),
  name: z.string().min(2, "Строка должна содержать 2 и более символов."),
});

export type CategoryRequest = z.infer<typeof CategoryValidator>;
