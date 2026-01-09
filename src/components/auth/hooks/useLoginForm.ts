"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/supabase";
import type { User } from "@supabase/supabase-js";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

export const useLoginForm = (onLoginSuccess?: () => void) => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

  // Thay thế 'any' bằng type 'User' từ supabase-js
  const createUserProfile = async (user: User) => {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      // Kiểm tra code lỗi PostgREST cụ thể
      if (fetchError && (fetchError as { code?: string }).code !== "PGRST116") {
        throw fetchError;
      }

      if (!existingUser) {
        const newUser: UserInsert = {
          id: user.id,
          email: user.email ?? "",
          username: user.user_metadata?.full_name || (user.email ?? "Unknown"),
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          karma: 0,
          is_online: true,
        };
        await supabase.from("users").insert([newUser]);
      } else {
        await supabase.from("users").update({ is_online: true }).eq("id", user.id);
      }
    } catch (err) {
      console.error("❌ Lỗi tạo hồ sơ:", err);
    }
  };

  const onSubmit = async (values: LoginFormSchema) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const { data, error } = await supabase.auth.signInWithPassword(values);

      if (error) throw error;

      if (data.user) {
        await createUserProfile(data.user);
      }

      router.refresh();
      onLoginSuccess?.();
      window.location.href = "/";
    } catch (err: unknown) {
      // Xử lý lỗi một cách an toàn thay vì dùng any
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
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Lỗi Google login");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    errorMsg,
    showSignUpModal,
    setShowSignUpModal,
    showForgotPasswordModal,
    setShowForgotPasswordModal,
    onSubmit,
    handleGoogleLogin,
  };
};