'use client'

import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/supabase'
import { Loader2 } from 'lucide-react'

interface LoginFormProps {
  onLoginSuccess?: () => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const supabase = createPagesBrowserClient<Database>()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleEmailLogin = async () => {
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    onLoginSuccess?.()
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
      />

      <button
        onClick={handleEmailLogin}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 rounded"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Logging in...
          </div>
        ) : (
          'Login with Email'
        )}
      </button>

      <div className="text-center text-sm text-gray-500">or</div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium py-2 rounded"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Connecting...
          </div>
        ) : (
          'Continue with Google'
        )}
      </button>

      {errorMsg && (
        <p className="text-sm text-red-500 text-center mt-2">{errorMsg}</p>
      )}
    </div>
  )
}
