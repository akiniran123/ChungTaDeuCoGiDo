'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { ShoppingBag } from 'lucide-react';

export default function StartSellingButtons({ onRequireLogin }: { onRequireLogin: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleStartSelling = () => {
    if (user) router.push('/protected/sell');
    else onRequireLogin();
  };

  return (
  <div className="inline-block relative group"> 
    {/* Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition duration-300"></div>

    {/* Button */}
    <button
      onClick={handleStartSelling}
      className="relative flex items-center justify-center gap-2 bg-[#111] text-purple-300 font-semibold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-[1px] active:scale-95 transition-all duration-200 border border-gray-800"
    >
      <ShoppingBag size={18} />
      <span>Bán hàng</span>
    </button>
  </div>
);
}
