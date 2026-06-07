"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteDialog from "./DeleteDialog";
import { useDiagramApi } from "@/src/context/DiagramContext";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";

const AnimatedTable = () => {
  const router = useRouter();
  const { diagrams, fetching, listDiagrams } = useDiagramApi();

  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    listDiagrams().catch(() => {});
  }, [listDiagrams]);

  const fmt = (iso?: string) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const handleRowClick = (d: { _id: string; type: string }) => {
    if (navigating) return;
    setNavigating(true);
    router.push(`/diagram/${d.type}/${d._id}`);
  };

  return (
    <div className="relative w-full rounded-md shadow-xl bg-card border border-border transition-colors duration-300">
      {/* Page overlay spinner while navigating */}
      {navigating && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm"
          aria-busy="true"
          aria-live="polite"
        >
          <Spinner />
        </div>
      )}

      <Table className="mx-auto">
        <TableHeader>
          <TableRow
            className="
            bg-gradient-to-r from-blue-50 to-blue-100
            dark:from-slate-800 dark:to-slate-900
          "
          >
            <TableHead className="text-foreground font-semibold">
              Title
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Last Updated
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Created Time
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Diagram Type
            </TableHead>
            <TableHead className="text-right text-foreground font-semibold" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Skeleton while fetching initial load */}
          {fetching && !diagrams && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`} className="animate-pulse">
                  <TableCell className="font-semibold">
                    <div className="h-4 w-32 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-24 bg-muted rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}

          {/* Empty state */}
          {!fetching && (!diagrams || diagrams.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-muted-foreground"
              >
                No diagrams yet.
              </TableCell>
            </TableRow>
          )}

          {/* Data rows */}
          {diagrams?.map((d) => (
            <TableRow
              key={d._id}
              className="
                transition-colors duration-150 cursor-pointer
                hover:bg-muted/60
              "
              onClick={() => handleRowClick(d)}
            >
              <TableCell className="font-semibold text-foreground">
                {d.title || "Untitled"}
              </TableCell>
              <TableCell className="text-foreground/90">
                {fmt(d.updatedAt)}
              </TableCell>
              <TableCell className="text-foreground/90">
                {fmt(d.createdAt)}
              </TableCell>
              <TableCell className="uppercase text-foreground/90">
                {d.type}
              </TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <DeleteDialog diagramId={d._id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnimatedTable;
