import { z } from "zod";

export const ProductValidator = z.object({
  amount: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  isArchived: z.boolean().default(false).optional(),
  isFeatured: z.boolean().default(false).optional(),
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  sizeId: z.string().min(1),
});

export type ProductRequest = z.infer<typeof ProductValidator>;
