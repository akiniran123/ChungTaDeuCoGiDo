'use client';

import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
      setErrorMsg('Login failed. Please try again.');
      setLoading(false);
    }
  };

  // Listen to auth change and auto-close if login succeeds
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        onClose();
      }
    });

    // cleanup listener on unmount
    return () => {
      listener.subscription?.unsubscribe?.();
    };
  }, []);

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
