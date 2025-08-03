export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type SomeTableRow = {
  id: string;
  created_at: string;
  data: Json; // 👈 chính xác hơn object
};

export type SomeTableInsert = {
  id?: string;
  created_at?: string;
  data: Json;
};

export type SomeTableUpdate = {
  id?: string;
  created_at?: string;
  data?: Json;
};

export type Database = {
  public: {
    Tables: {
      some_table: {
        Row: SomeTableRow;
        Insert: SomeTableInsert;
        Update: SomeTableUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
