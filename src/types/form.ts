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
  // Bỏ images hoặc để optional nếu sau này dùng lại
  images: z.array(z.instanceof(File)).max(10).optional(),
  videoUrl: z.string().url().optional(),
  price: z.number().min(0),
  enableOffers: z.boolean(),
  minOffer: z.number().min(0),
  quantity: z.number().min(1),
  sku: z.string().optional(),
  returnPolicy: z.enum(['no_returns', '7_days', '14_days']).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
