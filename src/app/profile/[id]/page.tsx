// app/profile/[id]/page.tsx
import OtherUserProfileClient from "@/components/OtherUserProfileClient/ProfileClient";

export default function Page({ params }: { params: { id: string } }) {
  return <OtherUserProfileClient userId={params.id} />;
}