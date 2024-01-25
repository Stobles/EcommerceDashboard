import { z } from "zod";

export const SizeValidator = z.object({
  name: z.string().min(1, "Строка не должна быть пустой."),
  value: z.string().min(1, "Строка не должна быть пустой."),
});

export type SizeRequest = z.infer<typeof SizeValidator>;
