// src/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

let _supabase: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClientOrNull() {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  _supabase = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _supabase;
}

/**
 * Non-null helper: throws if env not configured.
 * Use this when you want a hard failure instead of null.
 */
export function getSupabaseClient() {
  const client = getSupabaseClientOrNull();
  if (!client) {
    throw new Error(
      "Supabase client not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return client;
}