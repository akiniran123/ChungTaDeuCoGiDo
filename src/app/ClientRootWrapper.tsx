"use client";

import dynamic from "next/dynamic";

// ✅ Use dynamic import here (client component)
const ClientRoot = dynamic(() => import("./ClientRoot"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-gray-500">Loading...</div>
  ),
});

export default function ClientRootWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientRoot>{children}</ClientRoot>;
}
