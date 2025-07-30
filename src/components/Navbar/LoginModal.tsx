'use client';

import { Dialog } from '@headlessui/react';
import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const supabase = createClientComponentClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`, // đảm bảo route callback tồn tại
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
    }
  };

  // Tự động đóng modal nếu đã đăng nhập
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        onClose();
      }
    };
    checkUser();
  }, []);

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen bg-black/40">
        <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-md p-6 w-full max-w-sm shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
            Sign in to Jawa.gg
          </Dialog.Title>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded"
          >
            Continue with Google
          </button>

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
