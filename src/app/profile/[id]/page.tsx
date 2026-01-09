import ProfileView from "@/components/profile/ProfileView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <ProfileView profileId={resolvedParams.id} />
    </div>
  );
}