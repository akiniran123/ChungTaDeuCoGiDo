'use client';

import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from '@/types/supabase';
import LoginForm from '@/components/LoginForm';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
  redirectTo?: string; // 👈 Add this
}

export default function LoginModal({ onClose, onLoginSuccess, redirectTo }: LoginModalProps) {
  const supabase = createPagesBrowserClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        onClose();
        onLoginSuccess?.();
        if (redirectTo) {
          router.push(redirectTo); // 👈 redirect here
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, onClose, onLoginSuccess, redirectTo, router]);

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen bg-black/40 px-4">
        <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-md p-6 w-full max-w-sm shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
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
      </div>
    </Dialog>
  );
}
