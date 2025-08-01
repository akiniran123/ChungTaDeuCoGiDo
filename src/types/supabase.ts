export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Row = {
  id: string;
  created_at: string;
  data: object; // 👈 thay vì {}
};

export type SomeTable = {
  Row: object;    // 👈 thay vì {}
  Insert: object; // 👈
  Update: object; // 👈
};

export type Database = {
  public: {
    Tables: {
      some_table: SomeTable;
    };
    Views: Record<string, never>;     // hoặc object nếu bạn muốn cho phép thêm
    Functions: Record<string, never>; // tương tự
  };
};
