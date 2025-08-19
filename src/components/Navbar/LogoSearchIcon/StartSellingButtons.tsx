'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function StartSellingButtons({
  onRequireLogin,
}: { onRequireLogin: () => void }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  const handleStartSelling = () => {
    if (user) router.push('/protected/sell')
    else onRequireLogin()
  }

  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={() => router.push('/list')}
        aria-label="Start Your Build"
        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] relative z-30 min-w-[140px] text-white"
      >
        <span className="mr-2 text-lg">🚀</span>
        <span className="whitespace-nowrap">Xây dựng máy tính</span>
      </button>

      <button
        onClick={handleStartSelling}
        className="inline-flex items-center justify-center bg-[#9b4de0] text-white font-semibold text-sm px-5 py-2 rounded-full cursor-pointer shadow-sm hover:bg-[#873ac7] hover:shadow-lg active:scale-[0.98] transition duration-200 relative z-20"
      >
        Bắt đầu bán hàng
      </button>
    </div>
  )
}
