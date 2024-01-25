import { z } from "zod";

export const ColorValidator = z.object({
  name: z.string().min(1, "Строка не должна быть пустой."),
  value: z
    .string()
    .min(1, "Строка не должна быть пустой.")
    .regex(
      new RegExp(/#([a-f0-9]{6}|[a-f0-9]{3})\b/gi),
      "Значение не является hex-цветом"
    ),
});

export type ColorRequest = z.infer<typeof ColorValidator>;
