"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSignUp } from "@/components/auth/hooks/useSignUp";

const inputClass =
  "w-full px-3 py-2 border rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-700";

export default function SignUpModal({ onClose }: { onClose: () => void }) {
  const {
    form: { register, handleSubmit, formState: { errors } },
    loading,
    errorMsg,
    successMsg,
    onSubmit,
  } = useSignUp();

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl transition-all border dark:border-gray-800">
                <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                  Đăng ký tài khoản
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                  {errorMsg && <div className="text-sm text-red-500 text-center font-medium">{errorMsg}</div>}
                  {successMsg && <div className="text-sm text-green-600 text-center font-medium">{successMsg}</div>}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" {...register("email")} className={inputClass} placeholder="example@gmail.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mật khẩu</label>
                    <input type="password" {...register("password")} className={inputClass} placeholder="••••••••" />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nhập lại mật khẩu</label>
                    <input type="password" {...register("confirmPassword")} className={inputClass} placeholder="••••••••" />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-bold transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? "Đang xử lý..." : "Đăng ký ngay"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition cursor-pointer font-medium">
                    Quay lại đăng nhập
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}