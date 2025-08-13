// src/components/diagram/CreateDiagramSheet.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDiagramApi } from "@/src/context/DiagramContext";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";

type DiagramType = "erd"; // extend later as needed

export default function CreateDiagramSheet({
  triggerLabel = "Create New Diagram",
  className = "",
}: {
  triggerLabel?: string;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<DiagramType>("erd");
  const [saving, setSaving] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const { createDiagram, creating } = useDiagramApi();

  const busy = saving || creating || isPending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a diagram name.");
      return;
    }
    setSaving(true);
    try {
      const doc = await createDiagram(name.trim(), type);
      toast.success("Diagram created!");
      // keep UI in a transition while navigating
      startTransition(() => {
        router.push(`/diagram/${doc.type}/${doc._id}`);
      });
      // setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className={className} disabled={busy}>
          {triggerLabel}
        </Button>
      </SheetTrigger>

      <SheetContent>
        <form
          onSubmit={onSubmit}
          className="relative flex h-full flex-col p-3"
          aria-busy={busy}
        >
          <SheetHeader>
            <SheetTitle>Create a new diagram</SheetTitle>
            <SheetDescription>
              Give your diagram a name and choose a type.
            </SheetDescription>
          </SheetHeader>

          <div className="grid flex-1 auto-rows-min gap-6 pt-6">
            <div className="grid w-full gap-3">
              <Label htmlFor="diagram-name">Name</Label>
              <Input
                id="diagram-name"
                placeholder="e.g. Inventory ERD"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={busy}
              />
            </div>

            <div className="grid gap-3 w-full">
              <Label htmlFor="diagram-type">Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as DiagramType)}
                disabled={busy}
              >
                <SelectTrigger id="diagram-type" className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="erd">ERD</SelectItem>
                  {/* add more types later */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button type="submit" disabled={busy} aria-disabled={busy}>
              {busy ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating…
                </>
              ) : (
                "Save"
              )}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={busy}>
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>

          {/* Subtle overlay during create + navigation */}
          {busy && (
            <div className="pointer-events-none absolute inset-0 rounded-md bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Spinner className="h-5 w-5" />
                <span>Working…</span>
              </div>
            </div>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
