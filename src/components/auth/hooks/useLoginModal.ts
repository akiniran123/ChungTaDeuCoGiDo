"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;

interface UseLoginModalProps {
  onLoginSuccess?: () => void;
  redirectTo?: string;
  onClose: () => void;
}

export const useLoginModal = ({ onLoginSuccess, redirectTo, onClose }: UseLoginModalProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeModal, setActiveModal] = useState<"login" | "signup" | "forgot">("login");

  // Xử lý Portal và Khóa cuộn trang
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

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const { error } = await supabase.auth.signInWithPassword(data);
      if (error) throw error;

      router.refresh();
      onLoginSuccess?.();

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        window.location.href = "/";
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Đăng nhập thất bại");
      }
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Lỗi Google login");
      }
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      router.refresh();
      onLoginSuccess?.();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Đăng nhập ẩn danh thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    mounted,
    loading,
    errorMsg,
    showPassword,
    setShowPassword,
    activeModal,
    setActiveModal,
    form,
    onSubmit,
    handleGoogleLogin,
    handleAnonymousLogin,
  };
};