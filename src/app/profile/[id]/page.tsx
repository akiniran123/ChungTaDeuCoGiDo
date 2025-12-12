import OtherUserProfileClient from "@/components/OtherUserProfileClient/ProfileClient";

export default function Page({ params }: { params: { id: string } }) {
  return <OtherUserProfileClient userId={params.id} />;
}