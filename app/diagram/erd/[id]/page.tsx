// app/diagram/erd/[id]/page.tsx
import DiagramPageClient from "../DiagramPageClient";

export default function Page({ params }: { params: { id: string } }) {
  // Fetching happens on the client so cookies are included automatically
  return <DiagramPageClient diagramId={params.id} />;
}
