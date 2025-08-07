'use client'

import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/supabase'
import { useRouter } from 'next/navigation'

interface SignUpModalProps {
  onClose: () => void
  onSignUpSuccess?: () => void
}

export default function SignUpModal({ onClose, onSignUpSuccess }: SignUpModalProps) {
  const supabase = createPagesBrowserClient<Database>()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      onSignUpSuccess?.()
      onClose()
      router.refresh()
    }
  }

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen bg-black/40 px-4">
        <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-md p-6 w-full max-w-sm shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
            Sign up for Jawa.gg
          </Dialog.Title>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded border bg-gray-100 dark:bg-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded border bg-gray-100 dark:bg-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <button
              onClick={onClose}
              className="mt-2 w-full text-sm text-center text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
