'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { ShoppingBag } from 'lucide-react';

export default function StartSellingButtons({
  onRequireLogin,
}: {
  onRequireLogin: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleStartSelling = () => {
    if (user) router.push('/protected/sell');
    else onRequireLogin();
  };

  return (
    <div className="relative group">
      {/* Hiệu ứng sáng mờ phía sau */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-60 group-hover:opacity-90 transition duration-300"></div>

      {/* Nút chính */}
      <button
        onClick={handleStartSelling}
        className="relative flex items-center justify-center gap-2 bg-white dark:bg-[#1a1a1a] text-[#9b4de0] dark:text-purple-300 font-semibold text-sm px-6 py-2.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-[1px] active:scale-95 transition-all duration-200 border border-gray-200 dark:border-gray-700"
      >
        <ShoppingBag size={18} className="text-[#9b4de0] dark:text-purple-300" />
        <span>Bắt đầu bán hàng</span>
      </button>
    </div>
  );
}
