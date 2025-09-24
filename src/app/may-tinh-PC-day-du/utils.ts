// utils.ts
import type { Dispatch, SetStateAction } from "react"

export const fmt = (v: number) => v.toLocaleString("vi-VN") + "₫"

export const toggleSet = (
  s: Set<string>,
  setFn: Dispatch<SetStateAction<Set<string>>>,
  value: string
) => {
  const next = new Set(s)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  setFn(next)
}
