'use client'

import { useEffect, useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsOpen(false)
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
    <Transition show={isOpen} appear>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => {
          setIsOpen(false)
          onClose()
        }}
      >
        <div className="min-h-screen px-4 text-center bg-black/40 flex items-center justify-center h-dvh overscroll-none touch-none">
          <Transition.Child
            as="div"
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-[18rem] sm:max-w-[20rem] md:max-w-[22rem] transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
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
