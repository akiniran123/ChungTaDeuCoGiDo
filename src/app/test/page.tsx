import { getServerClient } from "@/lib/supabase/serverClient";

export default async function TestPage() {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("products").select("*");


  console.log("Supabase data:", data, error);

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
