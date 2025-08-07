import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteDialog from "./DeleteDialog";

// Use your data and new columns
const tableRows = [
  {
    title: "Untitled",
    lastUpdated: "2025/08/07 10:14",
    created: "2025/08/07 10:14",
    savedDiagrams: "ERD",
  },
  {
    title: "Untitled",
    lastUpdated: "2025/08/07 10:14",
    created: "2025/08/07 10:14",
    savedDiagrams: "ERD",
  },
];

const AnimatedTable = () => {
  return (
    <div className="w-full rounded-md shadow-xl bg-white border border-slate-100 transition-all duration-300 ">
      <Table className="mx-auto">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 ">
            <TableHead className=" text-slate-700 font-semibold ">
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
          {tableRows.map((row, i) => (
            <tr
              key={i}
              className="transition-all duration-100 hover:bg-blue-50/60 cursor-pointer"
            >
              <TableCell className="font-semibold">{row.title}</TableCell>
              <TableCell>{row.lastUpdated}</TableCell>
              <TableCell>{row.created}</TableCell>
              <TableCell>{row.savedDiagrams}</TableCell>
              <TableCell>
                <DeleteDialog />
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnimatedTable;
