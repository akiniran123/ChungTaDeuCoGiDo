"use client";

import { FcGoogle } from "react-icons/fc";
import SignUpModal from "@/components/auth/components/SignUpModal";
import ForgotPasswordModal from "@/components/auth/components/ForgotPasswordModal";
import { useLoginForm } from "@/components/auth/hooks/useLoginForm";

export default function LoginForm({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const {
    form: { register, handleSubmit, formState: { errors } },
    loading,
    errorMsg,
    showSignUpModal,
    setShowSignUpModal,
    showForgotPasswordModal,
    setShowForgotPasswordModal,
    onSubmit,
    handleGoogleLogin,
  } = useLoginForm(onLoginSuccess);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            {...register("email")}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="relative text-center my-3">
          <span className="absolute left-0 top-1/2 w-full border-t border-gray-300 dark:border-gray-700" />
          <span className="relative bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">or</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="flex justify-between text-sm mt-4">
          <button type="button" className="text-indigo-600 hover:underline" onClick={() => setShowSignUpModal(true)}>
            Sign up
          </button>
          <button type="button" className="text-gray-500 hover:underline" onClick={() => setShowForgotPasswordModal(true)}>
            Forgot password?
          </button>
        </div>
      </form>

      {showSignUpModal && <SignUpModal onClose={() => setShowSignUpModal(false)} />}
      {showForgotPasswordModal && <ForgotPasswordModal onClose={() => setShowForgotPasswordModal(false)} />}
    </>
  );
}