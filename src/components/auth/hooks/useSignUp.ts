"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

const signUpSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type SignUpFormSchema = z.infer<typeof signUpSchema>;

export const useSignUp = () => {
  const supabase = createPagesBrowserClient<Database>();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormSchema) => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      setSuccessMsg("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      form.reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Đã có lỗi xảy ra trong quá trình đăng ký");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    errorMsg,
    successMsg,
    onSubmit,
  };
};