"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase/client";
import SignUpModal from "@/components/auth/SignUpModal";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import type { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

export default function LoginModal({
  onLoginSuccess,
}: {
  onLoginSuccess?: () => void;
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

  // ✅ Hàm tạo hoặc cập nhật hồ sơ người dùng
  const createUserProfile = async (user: any) => {
    try {
      const { data: existingUser } = await supabase
        .from("người_dùng")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // tránh lỗi .single() khi không có dữ liệu

      if (!existingUser) {
        const newUser: Database["public"]["Tables"]["người_dùng"]["Insert"] = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          is_online: true,
        };

        const { error: insertError } = await supabase
          .from("người_dùng")
          .insert([newUser]);

        if (insertError) throw insertError;
        console.log("🆕 Hồ sơ người dùng mới đã được tạo");
      } else {
        // Cập nhật trạng thái online nếu đã có
        const { error: updateError } = await supabase
          .from("người_dùng")
          .update({ is_online: true })
          .eq("id", user.id);

        if (updateError) throw updateError;
      }
    } catch (err) {
      console.error("❌ Lỗi tạo hồ sơ người dùng:", err);
    }
  };

  // ✅ Xử lý đăng nhập email/password
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

      console.log("✅ Đăng nhập thành công:", res);
      router.refresh();
      onLoginSuccess?.();
      window.location.href = "/";
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || "Google login failed");
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

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Password
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium"
          >
            {loading ? "Signing in..." : "Sign in"}
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
