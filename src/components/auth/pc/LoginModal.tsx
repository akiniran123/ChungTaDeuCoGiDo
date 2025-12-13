"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

type AuthUser = {
  id: string;
  email: string | null;
  user_metadata?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};

function extractErrorMessage(err: unknown): string | null {
  if (!err) return null;
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null && "message" in err) {
    const maybeMessage = (err as { message?: unknown }).message;
    return typeof maybeMessage === "string" ? maybeMessage : null;
  }
  try {
    return String(err);
  } catch {
    return null;
  }
}

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
  const [mounted, setMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<"login" | "signup" | "forgot">(
    "login"
  );

  // Mount + ESC key
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({ resolver: zodResolver(loginSchema) });

  const createUserProfile = async (user: AuthUser) => {
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
          username:
            user.user_metadata?.username ||
            (user.email ? user.email.split("@")[0] : ""),
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
      if (user) {
        const authUser: AuthUser = {
          id: user.id,
          email: user.email ?? null,
          user_metadata:
            (user.user_metadata as AuthUser["user_metadata"]) || null,
        };
        await createUserProfile(authUser);
      }

      router.refresh();
      onLoginSuccess?.();
      if (redirectTo) router.push(redirectTo);
      else window.location.href = "/";
      onClose();
    } catch (err) {
      setErrorMsg(extractErrorMessage(err) || "Đăng nhập thất bại");
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
    } catch (err) {
      setErrorMsg(extractErrorMessage(err) || "Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {activeModal === "login" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="flex w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900">
            
            {/* Left panel: Logo + QR + Illustration */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-indigo-500 to-purple-600 flex-col justify-between items-center p-10">
              <div className="flex flex-col items-center mt-10">
                <img
                  src="/logo-nexloot.png"
                  alt="Logo Nexloot"
                  className="w-24 h-24 mb-4"
                />
                <h1 className="text-white text-3xl font-bold mb-6">Nexloot</h1>
                <img
                  src="/login-illustration.png"
                  alt="Hình minh họa"
                  className="w-64 h-auto object-contain mb-6"
                />
              </div>
              <div className="flex flex-col items-center mb-10">
                <p className="text-white text-sm mb-2">Tải app Nexloot</p>
                <img
                  src="/qr-code.png"
                  alt="Mã QR"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>

            {/* Right panel: Login form */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-4xl font-bold transition-transform hover:scale-110 cursor-pointer"
              >
                ×
              </button>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Chào mừng trở lại
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {errorMsg && (
                  <p className="text-red-500 text-center">{errorMsg}</p>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <div className="flex items-center my-4">
                  <hr className="flex-grow border-gray-300 dark:border-gray-700" />
                  <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">
                    hoặc
                  </span>
                  <hr className="flex-grow border-gray-300 dark:border-gray-700" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-white dark:bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-200 text-gray-800 dark:text-gray-900 text-sm font-medium transition-all cursor-pointer"
                >
                  <FcGoogle className="w-6 h-6" />
                  Tiếp tục với Google
                </button>

                <div className="flex justify-between text-sm mt-6">
                  <button
                    type="button"
                    className="text-indigo-600 hover:underline font-medium cursor-pointer"
                    onClick={() => setActiveModal("signup")}
                  >
                    Đăng ký
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 hover:underline font-medium cursor-pointer"
                    onClick={() => setActiveModal("forgot")}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeModal === "signup" && (
        <SignUpModal onClose={() => setActiveModal("login")} />
      )}

      {activeModal === "forgot" && (
        <ForgotPasswordModal onClose={() => setActiveModal("login")} />
      )}
    </>,
    document.body
  );
}
