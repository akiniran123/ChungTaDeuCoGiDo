export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      images: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          image_url?: string;
        };
      };
    };
  };
}
