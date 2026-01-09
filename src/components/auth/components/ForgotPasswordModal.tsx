'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForgotPassword } from '@/components/auth/hooks/useForgotPassword';

export default function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  // Lấy toàn bộ logic từ hook
  const { email, setEmail, message, error, loading, handleReset } = useForgotPassword();

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
          <div className="fixed inset-0 bg-black/30" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                  Quên Mật Khẩu
                </Dialog.Title>

                {/* UI Form giữ nguyên nhưng code đã sạch hơn nhiều */}
                <form onSubmit={handleReset} className="space-y-4 mt-4">
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {message && <div className="text-green-600 text-sm">{message}</div>}

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? 'Đang gửi...' : 'Gửi Email Đặt Lại'}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={onClose}
                    className="text-sm text-gray-500 hover:underline cursor-pointer"
                  >
                    Hủy
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