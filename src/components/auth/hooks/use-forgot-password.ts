import { useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export function useForgotPassword() {
  const supabase = createPagesBrowserClient<Database>();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.');
    }

    setLoading(false);
  };

  return {
    email,
    setEmail,
    message,
    error,
    loading,
    handleReset
  };
}