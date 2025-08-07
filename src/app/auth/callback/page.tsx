// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const redirect = localStorage.getItem('redirectAfterLogin') || '/'
        router.push(redirect)
      } else {
        router.push('/')
      }
    })
  }, [router])

  return <p className="p-6 text-center">Logging in...</p>
}
