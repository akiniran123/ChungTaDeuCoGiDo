"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import SignUpModal from "@/components/auth/pc/SignUpModal";
import ForgotPasswordModal from "@/components/auth/pc/ForgotPasswordModal";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

function extractErrorMessage(err: unknown): string {
  if (!err) return "Đăng nhập thất bại";
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return "Đăng nhập thất bại";
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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeModal, setActiveModal] = useState<
    "login" | "signup" | "forgot"
  >("login");

  // Mount + ESC
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

  // -----------------------
  // EMAIL / PASSWORD LOGIN
  // -----------------------
  const onSubmit = async (data: LoginFormSchema) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      /**
       * ⚠️ IMPORTANT
       * - User profile đã được DB trigger tạo sẵn
       * - Frontend KHÔNG ghi vào bảng users
       */

      router.refresh();
      onLoginSuccess?.();

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        window.location.href = "/";
      }

      onClose();
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // GOOGLE LOGIN
  // -----------------------
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) throw error;
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {activeModal === "login" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="flex w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900">

            {/* LEFT PANEL */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-indigo-500 to-purple-600 flex-col justify-between items-center p-10">
              <div className="flex flex-col items-center mt-10">
                <div className="relative w-24 h-24 mb-4">
                  <Image
                    src="/logo-nexloot.png"
                    alt="Logo Nexloot"
                    width={96}
                    height={96}
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <h1 className="text-white text-3xl font-bold mb-6">
                  Nexloot
                </h1>

                <div className="relative w-64 h-[256px] mb-6">
                  <Image
                    src="/login-illustration.png"
                    alt="Minh họa đăng nhập"
                    width={256}
                    height={256}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>

              <div className="flex flex-col items-center mb-10">
                <p className="text-white text-sm mb-2">Tải app Nexloot</p>
                <div className="relative w-24 h-24">
                  <Image
                    src="/qr-code.png"
                    alt="QR Code tải app Nexloot"
                    width={96}
                    height={96}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-12 h-12 text-4xl text-gray-500 hover:text-gray-900 dark:hover:text-white"
                aria-label="Đóng"
              >
                ×
              </button>

              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                Chào mừng trở lại
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {errorMsg && (
                  <p className="text-red-500 text-center" role="alert">{errorMsg}</p>
                )}

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Mật khẩu</label>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800"
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <div className="flex items-center gap-2">
                  <hr className="flex-1" />
                  <span className="text-sm text-gray-500">hoặc</span>
                  <hr className="flex-1" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border"
                >
                  <FcGoogle className="w-6 h-6" />
                  Tiếp tục với Google
                </button>

                <div className="flex justify-between text-sm mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveModal("signup")}
                    className="text-indigo-600 hover:underline"
                  >
                    Đăng ký
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal("forgot")}
                    className="text-gray-500 hover:underline"
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