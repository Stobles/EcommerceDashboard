import { z } from "zod";

export const SettingsValidator = z.object({
  name: z.string().min(2, "Строка должна содержать 2 и более символов."),
});

export type SettingsRequest = z.infer<typeof SettingsValidator>;
