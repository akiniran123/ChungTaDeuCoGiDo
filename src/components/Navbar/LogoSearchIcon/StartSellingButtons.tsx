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
    <div>
      <button
        onClick={handleStartSelling}
        className="inline-flex items-center justify-center bg-[#9b4de0] text-white font-semibold text-sm px-5 py-2 rounded-full cursor-pointer shadow-sm hover:bg-[#873ac7] hover:shadow-lg active:scale-[0.98] transition duration-200"
      >
        Bắt đầu bán hàng
      </button>
    </div>
  )
}
