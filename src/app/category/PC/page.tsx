'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PCPage() {
  const router = useRouter()

  const [filterType, setFilterType] = useState('all')
  const [showFilter, setShowFilter] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCPU, setSelectedCPU] = useState('')
  const [selectedProductImage, setSelectedProductImage] = useState<{ [key: number]: string }>({})

    const products = [
  {
    id: 1,
    type: 'gaming',
    brand: 'ASUS',
    cpu: 'Intel Core i7',
    gpu: 'RTX 4070',
    ram: '16GB',
    name: 'PC Gaming ASUS RTX 4070',
    price: '35,000,000₫',
    description: 'Hiệu năng cao, chơi game mượt mà',
    images: [
      'https://images.unsplash.com/photo-1612831455542-2d3e2b9c8b91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612831455645-4b9f9c9e5d32?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 2,
    type: 'office',
    brand: 'HP',
    cpu: 'Intel Core i5',
    gpu: 'Intel UHD',
    ram: '8GB',
    name: 'PC Văn phòng HP Core i5',
    price: '12,000,000₫',
    description: 'Tiết kiệm điện, chạy ổn định',
    images: [
      'https://images.unsplash.com/photo-1587202372775-9899f1f9c3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587202372790-7b2d9c8f7e2b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 3,
    type: 'workstation',
    brand: 'Dell',
    cpu: 'AMD Ryzen 9',
    gpu: 'RTX 3080',
    ram: '32GB',
    name: 'Workstation Dell RTX 3080',
    price: '45,000,000₫',
    description: 'Phục vụ dựng phim, thiết kế 3D chuyên nghiệp',
    images: [
      'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603791440390-7a1f8f7e8e2b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 4,
    type: 'gaming',
    brand: 'MSI',
    cpu: 'AMD Ryzen 7',
    gpu: 'RX 6800 XT',
    ram: '16GB',
    name: 'PC Gaming MSI Ryzen 7',
    price: '30,000,000₫',
    description: 'Chiến game AAA cực mượt',
    images: [
      'https://images.unsplash.com/photo-1612831455702-5b2e9c8f7b91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612831455720-9b3e8c9f5d32?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 5,
    type: 'office',
    brand: 'Lenovo',
    cpu: 'Intel Core i3',
    gpu: 'Intel UHD',
    ram: '8GB',
    name: 'Lenovo ThinkCentre Core i3',
    price: '9,500,000₫',
    description: 'PC văn phòng gọn nhẹ, bền bỉ',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517336714732-4a2e9c8f7b91?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 6,
    type: 'mini',
    brand: 'Intel',
    cpu: 'Intel Core i5',
    gpu: 'Intel Iris Xe',
    ram: '16GB',
    name: 'Intel NUC Mini PC',
    price: '15,000,000₫',
    description: 'Mini PC nhỏ gọn, tiết kiệm không gian',
    images: [
      'https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593642634368-5b2e9c8f7b91?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 7,
    type: 'gaming',
    brand: 'Gigabyte',
    cpu: 'Intel Core i9',
    gpu: 'RTX 4090',
    ram: '64GB',
    name: 'PC Gaming Gigabyte RTX 4090',
    price: '75,000,000₫',
    description: 'Máy quái vật dành cho game 4K, VR và livestream',
    images: [
      'https://images.unsplash.com/photo-1612831455750-7b2e9c8f5d32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612831455765-4b3e8c9f5d33?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 8,
    type: 'workstation',
    brand: 'Apple',
    cpu: 'Apple M2 Ultra',
    gpu: 'Integrated GPU 60-core',
    ram: '128GB',
    name: 'Mac Studio Workstation',
    price: '120,000,000₫',
    description: 'Cỗ máy mạnh mẽ cho nhà sáng tạo nội dung chuyên nghiệp',
    images: [
      'https://images.unsplash.com/photo-1655720305387-3a59e9f1e43f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1655720305547-5c40d9e4e7f6?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 9,
    type: 'gaming',
    brand: 'Acer',
    cpu: 'AMD Ryzen 5',
    gpu: 'RTX 3060',
    ram: '16GB',
    name: 'Acer Nitro Gaming PC',
    price: '25,000,000₫',
    description: 'Giải pháp gaming phổ thông mạnh mẽ',
    images: [
      'https://images.unsplash.com/photo-1612831455772-5b3e8c9f5d34?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612831455789-7b3e8c9f5d35?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 10,
    type: 'office',
    brand: 'Dell',
    cpu: 'Intel Core i7',
    gpu: 'Intel UHD',
    ram: '16GB',
    name: 'Dell OptiPlex i7',
    price: '18,000,000₫',
    description: 'Dòng máy văn phòng cao cấp, bền bỉ',
    images: [
      'https://images.unsplash.com/photo-1612831455799-5b3e8c9f5d36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612831455805-7b3e8c9f5d37?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 11,
    type: 'mini',
    brand: 'Apple',
    cpu: 'Apple M1',
    gpu: 'Integrated GPU 8-core',
    ram: '16GB',
    name: 'Mac Mini M1',
    price: '20,000,000₫',
    description: 'Mini PC mạnh mẽ, tối ưu hệ sinh thái Apple',
    images: [
      'https://images.unsplash.com/photo-1612831455815-5b3e8c9f5d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612831455820-7b3e8c9f5d39?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 12,
    type: 'workstation',
    brand: 'HP',
    cpu: 'Intel Xeon',
    gpu: 'Quadro RTX 5000',
    ram: '64GB',
    name: 'HP Z Workstation',
    price: '95,000,000₫',
    description: 'Máy trạm cho kỹ sư và thiết kế 3D',
    images: [
      'https://images.unsplash.com/photo-1612831455830-5b3e8c9f5d40?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612831455835-7b3e8c9f5d41?auto=format&fit=crop&w=800&q=80',
    ],
  },
];



  const filteredProducts = products.filter((product) => {
    const matchType = filterType === 'all' || product.type === filterType
    const matchBrand = selectedBrand === '' || product.brand === selectedBrand
    const matchCPU = selectedCPU === '' || product.cpu.includes(selectedCPU)
    return matchType && matchBrand && matchCPU
  })

  const resetFilters = () => {
    setFilterType('all')
    setSelectedBrand('')
    setSelectedCPU('')
  }

  return (
    <div className="pt-20 p-6 max-w-screen-xl mx-auto">
      {/* Thanh menu loại sản phẩm */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        {['all', 'gaming', 'office', 'workstation', 'mini'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filterType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {type === 'all'
              ? 'Tất cả'
              : type === 'gaming'
              ? 'PC Gaming'
              : type === 'office'
              ? 'PC Văn phòng'
              : type === 'workstation'
              ? 'Workstation'
              : 'Mini PC'}
          </button>
        ))}

        <button
          onClick={() => router.push('/list')}
          aria-label="Start Your Build"
          className="inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:bg-green-700 hover:shadow-lg active:scale-[0.98] text-white"
        >
          <span className="mr-2 text-lg">🚀</span>
          <span className="whitespace-nowrap">Xây dựng máy tính</span>
        </button>
      </div>

      {/* Nút lọc chi tiết */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <span className="text-xl">☰</span>
          <span className="text-sm font-medium">Bộ lọc</span>
        </button>
        {showFilter && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 hover:bg-red-200 transition"
          >
            Reset
          </button>
        )}
      </div>

      {/* Khung lọc chi tiết */}
      {showFilter && (
        <div className="mb-6 border p-4 rounded-lg bg-gray-50 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hãng sản xuất</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Tất cả</option>
                <option value="ASUS">ASUS</option>
                <option value="HP">HP</option>
                <option value="Dell">Dell</option>
                <option value="MSI">MSI</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Intel">Intel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPU</label>
              <select
                value={selectedCPU}
                onChange={(e) => setSelectedCPU(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Tất cả</option>
                <option value="Intel Core i3">Intel Core i3</option>
                <option value="Intel Core i5">Intel Core i5</option>
                <option value="Intel Core i7">Intel Core i7</option>
                <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                <option value="AMD Ryzen 9">AMD Ryzen 9</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tiêu đề */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Danh mục PC</h1>
        <p className="text-gray-600">
          Khám phá các dòng máy tính Gaming, Văn phòng, Workstation, Mini PC chất lượng.
        </p>
      </div>

      {/* Khung sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const mainImage = selectedProductImage[product.id] || product.images[0]
          return (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="flex gap-2 p-2 justify-center">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumb"
                    className={`w-12 h-12 object-cover rounded cursor-pointer border ${
                      mainImage === img ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() =>
                      setSelectedProductImage((prev) => ({ ...prev, [product.id]: img }))
                    }
                  />
                ))}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Hãng:</strong> {product.brand}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>CPU:</strong> {product.cpu}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>GPU:</strong> {product.gpu}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>RAM:</strong> {product.ram}
                </p>
                <p className="text-sm text-blue-600 font-semibold mt-2">
                  Giá: {product.price}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
