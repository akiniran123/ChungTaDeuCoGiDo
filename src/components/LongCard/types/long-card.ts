// types/long-card.ts
export type Product = {
  id: string;
  title: string;
  image_url?: string | null;
  tags?: string[];
  author?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
  category?: string | null;
  price?: number | null;
  views?: number | null;
  community_id?: string | null;
  communityName?: string | null;
  communityIcon?: string | null;
  user_id?: string | null;
};

export type LongCardProps = {
  product: Product;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  onToggleLike?: () => void;
  onToggleSave?: (id: string) => void;
  onShare?: () => void;
  onTagClick?: (tag: string) => void;
};