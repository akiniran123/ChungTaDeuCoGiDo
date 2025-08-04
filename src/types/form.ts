import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  category: z.string().min(1, 'Category is required'),
  isPrivate: z.boolean(),
  condition: z.enum([
    'brand_new',
    'new_open_box',
    'used_like_new',
    'used_good',
    'as_is',
  ]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  specs: z.array(
    z.object({
      key: z.string().min(1, 'Spec key is required'),
      value: z.string().min(1, 'Spec value is required'),
    })
  ),
  images: z.array(z.instanceof(File)).max(10, 'You can upload up to 10 images'),

  // ✅ Additional fields from other components
  videoUrl: z.string().url('Must be a valid URL').optional(),

  price: z.number().min(0, 'Price must be at least 0'),
  enableOffers: z.boolean().optional(),
  minOffer: z.number().min(0, 'Minimum offer must be at least 0').optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  sku: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
