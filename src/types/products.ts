// src/types/ui.ts
export type ProductWithUser = {
  id: string;
  title: string;
  category: string | null;
  is_private: boolean | null;
  condition: string | null;
  description: string | null;
  specs: unknown; // hoặc Json nếu bạn có type Json
  images: string | null;
  video_url: string | null;
  price?: number | null;
  created_at?: string | null;
  user_id?: string | null;
  tags: string | null; // nếu ProductsList expects string
  author?: string | null;
  avatar?: string | null;
  communityName?: string | null;
  communityIcon?: string | null;
  // thêm các trường khác mà ProductsList dùng
};