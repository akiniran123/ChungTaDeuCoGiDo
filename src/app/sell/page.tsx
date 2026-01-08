import SellFormView from "@/components/sell/Sell";

export const metadata = {
  title: "Đăng bán sản phẩm | My Store",
  description: "Trang đăng bán sản phẩm mới vào cộng đồng",
};

export default function SellPage() {
  return (
    <main className="min-h-screen py-10 bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">Đăng bán sản phẩm</h1>
        <SellFormView />
      </div>
    </main>
  );
}