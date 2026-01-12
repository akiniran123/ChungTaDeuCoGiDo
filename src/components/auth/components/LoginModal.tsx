"use client";

import { createPortal } from "react-dom";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { Eye, EyeOff, UserRoundSearch } from "lucide-react"; // Import thêm icon
import SignUpModal from "@/components/auth/components/SignUpModal";
import ForgotPasswordModal from "@/components/auth/components/ForgotPasswordModal";
import { useLoginModal } from "@/components/auth/hooks/useLoginModal";

export default function LoginModal({
  onLoginSuccess,
  redirectTo,
  onClose,
}: {
  onLoginSuccess?: () => void;
  redirectTo?: string;
  onClose: () => void;
}) {
  const {
    mounted,
    loading,
    errorMsg,
    showPassword,
    setShowPassword,
    activeModal,
    setActiveModal,
    form: { register, handleSubmit, formState: { errors } },
    onSubmit,
    handleGoogleLogin,
    handleAnonymousLogin, // Nhận hàm từ hook đã cập nhật
  } = useLoginModal({ onLoginSuccess, redirectTo, onClose });

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
                  <Image src="/logo-nexloot.png" alt="Logo" width={96} height={96} className="object-contain" unoptimized />
                </div>
                <h1 className="text-white text-3xl font-bold mb-6">Nexloot</h1>
                <div className="relative w-64 h-[256px] mb-6">
                  <Image src="/login-illustration.png" alt="Illustration" width={256} height={256} className="object-contain" unoptimized />
                </div>
              </div>
              <div className="flex flex-col items-center mb-10">
                <p className="text-white text-sm mb-2">Tải app Nexloot</p>
                <div className="relative w-24 h-24">
                  <Image src="/qr-code.png" alt="QR Code" width={96} height={96} className="object-contain" unoptimized />
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative max-h-[90vh] overflow-y-auto">
              <button onClick={onClose} className="absolute top-5 right-5 w-12 h-12 text-4xl text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer z-10">
                ×
              </button>

              <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Chào mừng trở lại</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMsg && <p className="text-red-500 text-center text-sm font-medium">{errorMsg}</p>}

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white outline-indigo-500"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium">Mật khẩu</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white pr-10 outline-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all active:scale-[0.97] disabled:opacity-60 cursor-pointer shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>

                <div className="flex items-center gap-2 py-2">
                  <hr className="flex-1 opacity-20" />
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">hoặc</span>
                  <hr className="flex-1 opacity-20" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* GOOGLE LOGIN */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.97] disabled:opacity-60 cursor-pointer font-medium"
                  >
                    <FcGoogle className="w-6 h-6" />
                    Google
                  </button>

                  {/* ANONYMOUS LOGIN */}
                  <button
                    type="button"
                    onClick={handleAnonymousLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-[0.97] disabled:opacity-60 cursor-pointer font-medium text-gray-700 dark:text-gray-200"
                  >
                    <UserRoundSearch className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    Khách dùng thử
                  </button>
                </div>

                <div className="flex justify-between text-sm mt-6">
                  <button type="button" onClick={() => setActiveModal("signup")} className="text-indigo-600 font-bold hover:underline cursor-pointer">
                    Tạo tài khoản mới
                  </button>
                  <button type="button" onClick={() => setActiveModal("forgot")} className="text-gray-500 hover:underline cursor-pointer">
                    Quên mật khẩu?
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeModal === "signup" && <SignUpModal onClose={() => setActiveModal("login")} />}
      {activeModal === "forgot" && <ForgotPasswordModal onClose={() => setActiveModal("login")} />}
    </>,
    document.body
  );
}