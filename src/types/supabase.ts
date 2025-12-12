// ----------- ĐỊNH NGHĨA KIỂU JSON CHUẨN CỦA SUPABASE -----------
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ----------- CẤU TRÚC DATABASE THEO SUPABASE -----------
export interface Database {
  public: {
    Tables: {
      // ----------- Bảng users -----------
      users: {
        Row: {
          id: string;
          username: string | null;
          email: string | null;
          created_at: string | null;
          updated_at: string | null;
          avatar_url: string | null;
          karma: number | null;
          is_online: boolean | null;
          address: string | null;
          identity: number | null;
          phone: number | null;
          birth: string | null;
        };
        Insert: {
          id?: string;
          username?: string | null;
          email?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          avatar_url?: string | null;
          karma?: number | null;
          is_online?: boolean | null;
          address?: string | null;
          identity?: number | null;
          phone?: number | null;
          birth?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
          email?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          avatar_url?: string | null;
          karma?: number | null;
          is_online?: boolean | null;
          address?: string | null;
          identity?: number | null;
          phone?: number | null;
          birth?: string | null;
        };
        Relationships: [];
      };

      // 🆕 Bảng user_tokens
user_tokens: {
  Row: {
    user_id: string;
    fcm_token: string;
    created_at: string | null;
  };
  Insert: {
    user_id: string;
    fcm_token: string;
    created_at?: string | null;
  };
  Update: {
    user_id?: string;
    fcm_token?: string;
    created_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "user_tokens_user_id_fkey";
      columns: ["user_id"];
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
};

      // ----------- Bảng products (ĐÚNG THEO BẢNG SUPABASE BẠN GỬI) -----------
products: {
  Row: {
    id: string;
    title: string;
    category: string | null;
    is_private: boolean | null;
    condition: string | null;
    description: string | null;
    specs: Json | null;
    images: string | null;
    video_url: string | null;
    price: number | null;
    enable_offers: boolean | null;
    min_offer: number | null;
    quantity: number | null;
    sku: string | null;
    return_policy: string | null;
    user_id: string;
    image_url: string | null;
    created_at: string | null;
    community_id: string | null;
    upvotes: number | null;
    views: number | null;
    is_completed: boolean | null;   // ← CÓ TRONG BẢNG
    tags: string | null;           // ← CÓ TRONG BẢNG
  };
  Insert: Omit<Database["public"]["Tables"]["products"]["Row"], 
    "id" | "created_at"
  >;
  Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
  Relationships: [
    {
      foreignKeyName: "products_user_id_fkey";
      columns: ["user_id"];
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
};

      // 🆕 Bảng product_likes
      product_likes: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_likes_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng communities — đã sửa theo DB thực tế của bạn
communities: {
  Row: {
    id: string;
    created_at: string;
    title: string | null;
    members_count: number | null;
    category: string | null;
    description: string | null;
    topics: string | null;
    online_count: number | null;
    avatar_url: string | null;
    banner_url: string | null;
    is_private: boolean | null;
    tags: string | null;
  };
  Insert: {
    id?: string;
    created_at?: string;
    title?: string | null;
    members_count?: number | null;
    category?: string | null;
    description?: string | null;
    topics?: string | null;
    online_count?: number | null;
    avatar_url?: string | null;
    banner_url?: string | null;
    is_private?: boolean | null;
    tags?: string | null;
  };
  Update: Partial<Database["public"]["Tables"]["communities"]["Insert"]>;
  Relationships: [];
};

      // 🆕 Bảng community_members
      community_members: {
        Row: {
          user_id: string;
          community_id: string;
          online: boolean | null;
          role: string | null;
        };
        Insert: {
          user_id: string;
          community_id: string;
          online?: boolean | null;
          role?: string | null;
        };
        Update: {
          user_id?: string;
          community_id?: string;
          online?: boolean | null;
          role?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "community_members_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_members_community_id_fkey";
            columns: ["community_id"];
            referencedRelation: "communities";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng user_communities
      user_communities: {
        Row: {
          id: string;
          user_id: string;
          community_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          community_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          community_id?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_communities_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_communities_community_id_fkey";
            columns: ["community_id"];
            referencedRelation: "communities";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng community_online_members
      community_online_members: {
        Row: {
          user_id: string;
          community_id: string;
        };
        Insert: {
          user_id: string;
          community_id: string;
        };
        Update: {
          user_id?: string;
          community_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_online_members_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_online_members_community_id_fkey";
            columns: ["community_id"];
            referencedRelation: "communities";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng comments
      comments: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          content: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          content?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          content?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng search_history
      search_history: {
        Row: {
          id: string;
          user_id: string;
          query: string | null;
          searched_at: string | null;
          device: string | null;
          location: string | null;
          title: string | null;
          inserted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          query?: string | null;
          searched_at?: string | null;
          device?: string | null;
          location?: string | null;
          title?: string | null;
          inserted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          query?: string | null;
          searched_at?: string | null;
          device?: string | null;
          location?: string | null;
          title?: string | null;
          inserted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng badges
      badges: {
        Row: {
          id: string;
          name: string;
          icon: string;
          milestone_type: string;
          milestone_value: number;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          milestone_type: string;
          milestone_value: number;
        };
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
        Relationships: [];
      };

      // 🆕 Bảng user_badges
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          received_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          received_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_badges_badge_id_fkey";
            columns: ["badge_id"];
            referencedRelation: "badges";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng notifications
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          data: Json | null;
          read: boolean | null;
          created_at: string | null;
          inserted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          data?: Json | null;
          read?: boolean | null;
          created_at?: string | null;
          inserted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng messages
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string | null;
          type: string | null;
          is_read: boolean | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at?: string | null;
          type?: string | null;
          is_read?: boolean | null;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_receiver_id_fkey";
            columns: ["receiver_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng product_tags
      product_tags: {
        Row: {
          id: string;
          product_id: string;
          tag_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          tag_id: string;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["product_tags"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };

      // 🆕 Bảng community_tags
      community_tags: {
        Row: {
          id: string;
          name: string;
          community_id: string;
          created_by: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          community_id: string;
          created_by: string;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["community_tags"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "community_tags_community_id_fkey";
            columns: ["community_id"];
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_tags_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: Record<string, never>;
Functions: Record<string, never>;
Enums: Record<string, never>;
CompositeTypes: Record<string, never>;

  };
}


// ----------- KIỂU PRODUCT ĐỒNG BỘ VỚI DỮ LIỆU SUPABASE -----------
export interface Product {
  id: string;
  title: string;
  category: string | null;
  is_private: boolean | null;
  condition: string | null;
  description: string | null;
  specs: Json | null;
  images: string[] | null;
  video_url: string | null;
  price: number | null;
  enable_offers: boolean | null;
  min_offer: number | null;
  quantity: number | null;
  sku: string | null;
  return_policy: string | null;
  user_id: string;
  image_url: string | null;
  created_at: string | null;
  community_id: string | null;
  upvotes: number | null;
  views: number | null;
  cpu?: string | null;
  gpu?: string | null;
}
