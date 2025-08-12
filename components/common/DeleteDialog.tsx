"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDiagramApi } from "@/src/context/DiagramContext";
import toast from "react-hot-toast";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";

export default function DeleteDialog({
  onDelete,
  diagramId,
}: {
  onDelete?: () => void;
  diagramId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { deleteDiagram, deleting } = useDiagramApi();

  const busy = isDeleting || deleting;

  const handleDelete = async () => {
    onDelete?.();
    try {
      setIsDeleting(true);
      await deleteDiagram(diagramId);
      toast.success("Diagram deleted");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-lg hover:scale-110"
          aria-label="Delete"
          disabled={busy}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash-icon lucide-trash text-red-600"
          >
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer disabled:opacity-60"
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition cursor-pointer disabled:opacity-60 inline-flex items-center"
            onClick={handleDelete}
            disabled={busy}
          >
            {busy ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
