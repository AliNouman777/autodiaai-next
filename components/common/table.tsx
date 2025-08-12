"use client";

import React, { useEffect } from "react";
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

const AnimatedTable = () => {
  const router = useRouter();
  const { diagrams, fetching, listDiagrams } = useDiagramApi();

  useEffect(() => {
    // load on mount
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

  return (
    <div className="w-full rounded-md shadow-xl bg-white border border-slate-100 transition-all duration-300">
      <Table className="mx-auto">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100">
            <TableHead className="text-slate-700 font-semibold">
              Title
            </TableHead>
            <TableHead className="text-slate-700 font-semibold">
              Last Updated
            </TableHead>
            <TableHead className="text-slate-700 font-semibold">
              Created Time
            </TableHead>
            <TableHead className="text-slate-700 font-semibold">
              Diagram Type
            </TableHead>
            <TableHead className="text-right text-slate-700 font-semibold"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Skeleton while fetching initial load */}
          {fetching && !diagrams && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`} className="animate-pulse">
                  <TableCell className="font-semibold">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 bg-slate-200 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 bg-slate-200 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-slate-200 rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-24 bg-slate-200 rounded ml-auto" />
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
                className="text-center py-6 text-slate-500"
              >
                No diagrams yet.
              </TableCell>
            </TableRow>
          )}

          {/* Data rows */}
          {diagrams?.map((d) => (
            <TableRow
              key={d._id}
              className="transition-all duration-100 hover:bg-blue-50/60 cursor-pointer"
              onClick={() => router.push(`/diagram/${d.type}/${d._id}`)}
            >
              <TableCell className="font-semibold">
                {d.title || "Untitled"}
              </TableCell>
              <TableCell>{fmt(d.updatedAt)}</TableCell>
              <TableCell>{fmt(d.createdAt)}</TableCell>
              <TableCell className="uppercase">{d.type}</TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()} // avoid row navigation when clicking delete
              >
                {/* Pass id if your dialog expects it */}
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
