import { CommunityDetailView } from "@/components/communities/CommunityDetailView";

// Đưa interface vào export (Named Export cho interface)
export interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <CommunityDetailView communityId={resolvedParams.id} />
    </main>
  );
}