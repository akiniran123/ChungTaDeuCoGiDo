'use client'

import { Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
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
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        {/* Overlay fade */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center px-4 sm:px-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-xs sm:max-w-sm md:max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl transition-all">
              <Dialog.Title className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
                Sign in to Jawa.gg
              </Dialog.Title>

              <LoginForm onLoginSuccess={onLoginSuccess} />

              <button
                onClick={onClose}
                className="mt-4 w-full text-sm text-center text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
