import { Message, User } from "@/components/MiniChat/MiniChatBox/type/types";

export function normalizeMessage(raw: any): Message {
  return {
    id: String(raw.id),
    sender_id: String(raw.sender_id),
    receiver_id: raw.receiver_id ?? undefined,
    content: String(raw.content ?? ""),
    created_at: raw.created_at ?? null,
    type: raw.type ?? null,
    is_read: typeof raw.is_read === "boolean" ? raw.is_read : null,
    ...raw,
  };
}

export function normalizePartner(data: any): User {
  return {
    id: data.id,
    username: data.username ?? null,
    avatar_url: data.avatar_url ?? null,
  };
}

export function buildOrFilter(a: string, b: string) {
  return `and(sender_id.eq.${a},receiver_id.eq.${b}),and(sender_id.eq.${b},receiver_id.eq.${a})`;
}
