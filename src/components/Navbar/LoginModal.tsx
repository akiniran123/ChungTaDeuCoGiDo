'use client'

import { useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import LoginForm from './LoginForm'
import type { Database } from '@/types/supabase'

interface LoginModalProps {
  onClose: () => void
  onLoginSuccess?: () => void
  redirectTo?: string
}

export default function LoginModal({ onClose, onLoginSuccess, redirectTo }: LoginModalProps) {
  const supabase = createPagesBrowserClient<Database>()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        onClose()
        onLoginSuccess?.()
        if (redirectTo) {
          router.push(redirectTo)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, onClose, onLoginSuccess, redirectTo, router])

 return (
  <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
    <div className="flex items-center justify-center min-h-screen bg-black/40 px-4">
      <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md sm:max-w-lg p-8 shadow-2xl transition-all duration-300">
        <Dialog.Title className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Sign in to Jawa.gg
        </Dialog.Title>

        <LoginForm onLoginSuccess={onLoginSuccess} />

        <button
          onClick={onClose}
          className="mt-6 w-full text-sm text-center text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </Dialog.Panel>
    </div>
  </Dialog>
)

}
