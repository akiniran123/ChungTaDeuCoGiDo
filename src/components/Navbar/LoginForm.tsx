'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import SignUpModal from '@/components/SignUpModal';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const supabase = createPagesBrowserClient<Database>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      onLoginSuccess?.();
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });

    if (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleEmailLogin} className="space-y-4">
        {errorMsg && (
          <div className="text-sm text-red-500 text-center">{errorMsg}</div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm"
          />
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {/* Divider */}
        <div className="relative text-center my-3">
          <span className="absolute left-0 top-1/2 w-full border-t border-gray-300 dark:border-gray-700"></span>
          <span className="relative bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">
            or
          </span>
        </div>

        {/* Google login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Signup & Forgot password links */}
        <div className="flex justify-between text-sm mt-4">
          <button
            type="button"
            className="text-indigo-600 hover:underline"
            onClick={() => setShowSignUpModal(true)}
          >
            Sign up
          </button>
          <button
            type="button"
            className="text-gray-500 hover:underline"
            onClick={() => setShowForgotPasswordModal(true)}
          >
            Forgot password?
          </button>
        </div>
      </form>

      {/* Modals */}
      {showSignUpModal && (
        <SignUpModal onClose={() => setShowSignUpModal(false)} />
      )}
      {showForgotPasswordModal && (
        <ForgotPasswordModal onClose={() => setShowForgotPasswordModal(false)} />
      )}
    </>
  );
}
