export type Product = {
  id: number
  type: 'gaming' | 'office' | 'workstation' | 'mini'
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
  seller?: {
    id: number // 👈 thêm nếu bạn đang dùng
    name: string
    avatar: string // 👈 sửa lại nếu bạn viết nhầm thành 'antar'
  }
}