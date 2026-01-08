import CommunitiesView from "@/components/communities/CommunitiesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khám phá Cộng đồng | My App",
  description: "Tham gia các cộng đồng thú vị và kết nối với mọi người.",
};

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-10 px-4">
      <CommunitiesView />
    </div>
  );
}