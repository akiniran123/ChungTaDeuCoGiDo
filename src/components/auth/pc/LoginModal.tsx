"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase/client";
import SignUpModal from "@/components/auth/pc/SignUpModal";
import ForgotPasswordModal from "@/components/auth/pc/ForgotPasswordModal";
import type { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

export default function LoginModal({
  onLoginSuccess,
  redirectTo,
  onClose,
}: {
  onLoginSuccess?: () => void;
  redirectTo?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({ resolver: zodResolver(loginSchema) });

  const createUserProfile = async (user: any) => {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existingUser) {
        const newUser: Database["public"]["Tables"]["users"]["Insert"] = {
          id: user.id,
          username: user.user_metadata?.username || user.email.split("@")[0],
          email: user.email,
          created_at: new Date().toISOString(),
          avatar_url: user.user_metadata?.avatar_url || null,
          is_online: true,
        };

        const { error: insertError } = await supabase
          .from("users")
          .insert([newUser]);

        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from("users")
          .update({ is_online: true })
          .eq("id", user.id);

        if (updateError) throw updateError;
      }
    } catch (err) {
      console.error("❌ Lỗi xử lý hồ sơ người dùng:", err);
    }
  };

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const { data: res, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      const user = res.user;
      if (user) await createUserProfile(user);

      router.refresh();
      onLoginSuccess?.();

      if (redirectTo) router.push(redirectTo);
      else window.location.href = "/";

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || "Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Đăng nhập button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="relative text-center my-3">
            <span className="absolute left-0 top-1/2 w-full border-t border-gray-300 dark:border-gray-700" />
            <span className="relative bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">
              hoặc
            </span>
          </div>

          {/* Tiếp tục với Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full border px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200
              ${loading
                ? "opacity-70 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-[0.98] cursor-pointer"
              }`}
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-gray-800 dark:text-gray-100">
              Tiếp tục với Google
            </span>
          </button>

          <div className="flex justify-between text-sm mt-4">
            {/* Đăng ký */}
            <button
              type="button"
              className="text-indigo-600 hover:underline cursor-pointer"
              onClick={() => setShowSignUpModal(true)}
            >
              Đăng ký
            </button>
            {/* Quên mật khẩu */}
            <button
              type="button"
              className="text-gray-500 hover:underline cursor-pointer"
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Quên mật khẩu?
            </button>
          </div>
        </form>

        {showSignUpModal && (
          <SignUpModal onClose={() => setShowSignUpModal(false)} />
        )}
        {showForgotPasswordModal && (
          <ForgotPasswordModal
            onClose={() => setShowForgotPasswordModal(false)}
          />
        )}
      </div>
    </div>
  );
}
