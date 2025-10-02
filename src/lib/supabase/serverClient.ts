import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

// ✅ Export sẵn một instance để dùng lại
export const supabase = createServerComponentClient<Database>({ cookies });