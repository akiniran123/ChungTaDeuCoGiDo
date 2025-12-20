"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useCurrentUser() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getUser().then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        console.error("[useCurrentUser] error:", error);
        return;
      }
      setCurrentUserId(data?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return currentUserId;
}
