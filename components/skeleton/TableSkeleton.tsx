import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full rounded-md shadow-xl bg-white border border-slate-100 transition-all duration-300 ">
      <Table className="mx-auto">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 ">
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
          {[...Array(rows)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-6 w-24 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-32 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-32 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24 rounded" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 rounded-full mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
