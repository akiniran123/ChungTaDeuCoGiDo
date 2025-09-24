export type Product = {
  id: number
  type: 'gaming' | 'office' | 'workstation' | 'mini'
  brand: string
  cpu: string
  gpu: string
  ram: string
  name: string
  price: number // VND as number
  description: string
  images: string[]
  stock?: number
}
