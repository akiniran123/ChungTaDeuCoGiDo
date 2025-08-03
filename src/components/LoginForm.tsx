// src/components/LoginForm.tsx
'use client'

import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/supabase'
import { Loader2 } from 'lucide-react'

interface LoginFormProps {
  onLoginSuccess?: () => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const supabase = createPagesBrowserClient<Database>()

  const handleLogin = async () => {
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.error('Login error:', error.message)
      setErrorMsg('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium py-2 rounded flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
            Connecting...
          </>
        ) : (
          'Continue with Google'
        )}
      </button>

      {errorMsg && (
        <p className="mt-3 text-sm text-red-500 text-center">{errorMsg}</p>
      )}
    </>
  )
}
