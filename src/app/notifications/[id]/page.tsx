import { getServerClient } from "@/lib/supabase/serverClient";

export default async function NotificationDetail({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await getServerClient();

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data)
    return <div className="p-6">Không tìm thấy thông báo.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-3">{data.title}</h1>

      {data.body && (
        <p className="text-gray-700 mb-4">{data.body}</p>
      )}

      <div className="text-sm text-gray-400">
        {data.created_at
          ? new Date(data.created_at).toLocaleString("vi-VN")
          : ""}
      </div>
    </div>
  );
}
