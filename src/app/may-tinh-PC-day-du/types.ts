// src/app/may-tinh-PC-day-du/types.ts
export type Product = {
  id: number
  type: "gaming" | "office" | "workstation" | "mini"
  brand: string
  cpu: string
  gpu: string
  ram: string
  name: string
  price: number
  description: string
  shortDesc?: string
  images: string[]
  stock?: number
  seller: {
    id: number
    name: string
    avatar: string
  }
}
