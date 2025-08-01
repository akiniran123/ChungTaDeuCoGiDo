export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Ví dụ: bảng products
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          category: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          category: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          category?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // Thêm các bảng khác nếu cần
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
