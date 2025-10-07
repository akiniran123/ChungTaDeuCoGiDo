'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';
// ❌ bỏ `createPagesBrowserClient`
// ✅ thay bằng client.ts của bạn
import { supabase } from '@/lib/supabase/client';
import SignUpModal from '@/components/auth/SignUpModal';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import type { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

export default function LoginForm({
  onLoginSuccess,
}: {
  onLoginSuccess?: () => void;
}) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({ resolver: zodResolver(loginSchema) });

  // ✅ Sửa phần xử lý đăng nhập
  const onSubmit = async (data: LoginFormSchema) => {
    try {
      setLoading(true);
      setErrorMsg('');

      const { data: res, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      console.log('✅ Đăng nhập thành công:', res);
      router.refresh();
      onLoginSuccess?.();
      window.location.href = '/';
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sửa phần đăng nhập Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`, // ✅ đường callback
        },
      });

      if (error) throw error;
      console.log('🔗 Google login redirect:', data?.url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {/* Divider */}
        <div className="relative text-center my-3">
          <span className="absolute left-0 top-1/2 w-full border-t border-gray-300 dark:border-gray-700" />
          <span className="relative bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">
            or
          </span>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Links */}
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
      {showSignUpModal && <SignUpModal onClose={() => setShowSignUpModal(false)} />}
      {showForgotPasswordModal && (
        <ForgotPasswordModal onClose={() => setShowForgotPasswordModal(false)} />
      )}
    </>
  );
}
