// Định nghĩa cấu trúc dữ liệu từ Table "users" trong Supabase
export type UserData = {
  id: string;
  username: string | null;
  email: string | null;
  created_at: string | null;
  avatar_url: string | null;
  karma: number | null;
  is_online: boolean | null;
  address: string | null;
  identity: number | null;
  phone: number | null;
  birth: string | null;
  updated_at?: string | null;
};

// Định nghĩa cấu trúc cho Form chỉnh sửa (thường là string để dễ quản lý input)
export type ProfileFormData = {
  username: string;
  avatar_url: string;
  address: string;
  phone: string;
  birth: string;
};