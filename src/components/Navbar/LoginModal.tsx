'use client';

import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { type Database } from '@/types/supabase';
import { Loader2 } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
      setErrorMsg('Login failed. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        onClose();
        onLoginSuccess?.();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, onClose, onLoginSuccess]);

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen bg-black/40 px-4">
        <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-md p-6 w-full max-w-sm shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
            Sign in to Jawa.gg
          </Dialog.Title>

          <button
            onClick={handleGoogleLogin}
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
