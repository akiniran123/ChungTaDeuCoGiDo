'use client'

import { useEffect, Fragment } from 'react'
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
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="
                  w-full 
                  max-w-md 
                  sm:max-w-lg 
                  md:max-w-xl 
                  lg:max-w-2xl
                  transform 
                  overflow-hidden 
                  rounded-xl 
                  bg-white 
                  dark:bg-gray-900 
                  p-8 
                  shadow-2xl 
                  transition-all 
                  max-h-[90vh] 
                  overflow-y-auto
                "
              >
                <Dialog.Title className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
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
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
