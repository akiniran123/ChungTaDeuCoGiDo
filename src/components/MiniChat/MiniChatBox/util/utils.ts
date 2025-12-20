// src/components/MiniChat/MiniChatBox/util/utils.ts
import { Message, User } from "@/components/MiniChat/MiniChatBox/type/types";

/**
 * Normalize a raw DB / realtime payload into a safe Message object.
 * Accepts unknown input and performs defensive conversions so the result
 * always matches the exported Message type (no `any` usage).
 */
export function normalizeMessage(raw: unknown): Message {
  const r = (raw ?? {}) as Record<string, unknown>;

  const id = r.id ?? "";
  const sender_id = r.sender_id ?? "";
  const receiver_id = r.receiver_id ?? undefined;
  const content = r.content ?? "";
  const created_at = r.created_at ?? null;
  const type = r.type ?? null;
  const is_read = typeof r.is_read === "boolean" ? (r.is_read as boolean) : null;

  const normalized: Message = {
    id: String(id),
    sender_id: String(sender_id),
    receiver_id: receiver_id === undefined ? undefined : String(receiver_id),
    content: String(content),
    created_at: created_at === null ? null : String(created_at),
    type: type === null ? null : String(type),
    is_read,
  };

  // Preserve any extra fields from the raw object while keeping the normalized core.
  // Cast is safe because we already ensured required fields exist and have correct types.
  return { ...normalized, ...(r as Record<string, unknown>) } as Message;
}

/**
 * Normalize a raw DB row into a safe User object.
 * Uses defensive conversions and allows username/avatar_url to be null.
 */
export function normalizePartner(data: unknown): User {
  const d = (data ?? {}) as Record<string, unknown>;

  const id = d.id ?? "";
  const username = d.username ?? null;
  const avatar_url = d.avatar_url ?? null;

  const normalized: User = {
    id: String(id),
    username: username === null ? null : String(username),
    avatar_url: avatar_url === null ? null : String(avatar_url),
  };

  return normalized;
}

/**
 * Build the Supabase OR filter string for two participant ids.
 */
export function buildOrFilter(a: string, b: string) {
  return `and(sender_id.eq.${a},receiver_id.eq.${b}),and(sender_id.eq.${b},receiver_id.eq.${a})`;
}