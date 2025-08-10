import React, { Suspense } from "react";

import Table from "@/components/common/table";
import StatefulButton from "@/components/common/StatefulButton";
import { TableSkeleton } from "@/components/skeleton/TableSkeleton";

const Page = () => {
  return (
    <div className="w-full">
     <StatefulButton
  label="Create New Diagram"
  navigateTo="/diagram/erd"
/>


      <Suspense fallback={<TableSkeleton rows={5} />}>
        <Table />
      </Suspense>
    </div>
  );
};

export default Page;
