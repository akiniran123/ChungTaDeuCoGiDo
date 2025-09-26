import { notFound } from "next/navigation"
import { products } from "../data"

export default function ProductDetail({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === Number(params.id))

  if (!product) return notFound()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.images?.[0] || "/placeholder.png"}
        alt={product.name}
        className="w-64 h-64 object-cover rounded mb-4"
      />
      <p>Hãng: {product.brand}</p>
      <p>CPU: {product.cpu}</p>
      <p>GPU: {product.gpu}</p>
      <p>RAM: {product.ram}</p>
      <p className="text-red-500 font-bold text-xl mt-4">
        {product.price.toLocaleString()} VND
      </p>
    </div>
  )
}
