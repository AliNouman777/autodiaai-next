// app/diagram/page.tsx (client or server is fine since wrapper is client)
import React, { Suspense } from "react";
import Table from "@/components/common/table";
import { TableSkeleton } from "@/components/skeleton/TableSkeleton";
import CreateDiagramSheet from "@/components/common/CreateDiagramSheet";
import RequireAuth from "@/components/RequireAuth";

export default function Page() {
  return (
    <RequireAuth>
      <div className="w-full gap-3 flex flex-col">
        <CreateDiagramSheet triggerLabel="Create Diagram" className="w-fit " />
        <Suspense fallback={<TableSkeleton rows={5} />}>
          <Table />
        </Suspense>
      </div>
    </RequireAuth>
  );
}
