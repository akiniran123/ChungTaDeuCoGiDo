"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@/components/MiniChat/MiniChatBox/type/types";
import { normalizePartner } from "@/components/MiniChat/MiniChatBox/util/utils";

export function usePartner(partnerId: string | null) {
  const [partner, setPartner] = useState<User | null>(null);

  useEffect(() => {
    if (!partnerId) {
      setPartner(null);
      return;
    }

    let cancelled = false;

    supabase
      .from("users")
      .select("id, username, avatar_url")
      .eq("id", partnerId)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[usePartner] error:", error);
          return;
        }
        setPartner(normalizePartner(data));
      });

    return () => {
      cancelled = true;
    };
  }, [partnerId]);

  return partner;
}
