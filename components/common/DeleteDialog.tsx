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

export default function DeleteDialog({ onDelete }: { onDelete?: () => void }) {
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    onDelete?.();
    setOpen(false); // Close dialog after delete
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-lg hover:scale-110"
          aria-label="Delete"
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
            className="rounded-md px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
