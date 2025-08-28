// app/diagram/page.tsx (client or server is fine since wrapper is client)
import React, { Suspense } from "react";
import Table from "@/components/common/table";
import { TableSkeleton } from "@/components/skeleton/TableSkeleton";
import CreateDiagramSheet from "@/components/common/CreateDiagramSheet";

export default function Page() {
  return (
    // <AuthWrapper>
    <div className="w-full gap-3 flex flex-col">
      <div className="flex w-full justify-between items-center">
        <CreateDiagramSheet
          triggerLabel="Create Diagram"
          className="w-fit cursor-pointer "
        />
      </div>
      <Suspense fallback={<TableSkeleton rows={5} />}>
        <Table />
      </Suspense>
    </div>
    // </AuthWrapper>
  );
}
