// app/diagram/erd/[id]/page.tsx
import DiagramPageClient from "../DiagramPageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ await the Promise
  return <DiagramPageClient diagramId={id} />;
}
