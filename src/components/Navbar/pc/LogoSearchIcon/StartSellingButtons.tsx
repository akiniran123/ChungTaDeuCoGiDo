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
      {/* Glow trung tính */}
      <div className="absolute inset-0 bg-neutral-300 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition duration-300"></div>

      {/* Button giống Tin nhắn */}
      <button
        onClick={handleStartSelling}
        className="relative flex items-center gap-4
        px-5 py-3 rounded-xl font-medium text-base text-gray-900
        hover:bg-gray-100 transition-all duration-200"
      >
        <ShoppingBag size={24} strokeWidth={1.5} className="text-gray-900" />
        <span>Bán hàng</span>
      </button>
    </div>
  );
}
