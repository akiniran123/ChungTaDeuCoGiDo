// src/types/form.ts

import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(5).max(100),
  category: z.string().min(1),
  isPrivate: z.boolean(),
  condition: z.enum([
    'brand_new',
    'new_open_box',
    'used_like_new',
    'used_good',
    'as_is',
  ]),
  description: z.string().min(10),
  specs: z.array(z.object({ key: z.string(), value: z.string() })),
  images: z.array(z.instanceof(File)).max(10),
});

export type ProductFormData = z.infer<typeof productSchema>;

// 👇 This line makes sure the file is treated as a module
export {};
