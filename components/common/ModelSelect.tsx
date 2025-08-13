"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CanonicalModel =
  | "gpt-5"
  | "gpt-5-mini"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite";

const OPTIONS: { value: CanonicalModel; label: string }[] = [
  { value: "gpt-5", label: "GPT-5" },
  { value: "gpt-5-mini", label: "GPT-5 mini" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite" },
];

export function ModelSelect({
  value,
  onChange,
  className = "w-full md:w-42 cursor-pointer bg-gray-50 border-gray-200 rounded-md",
  placeholder = "Select Model",
}: {
  value: CanonicalModel | undefined;
  onChange: (v: CanonicalModel) => void;
  className?: string;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as CanonicalModel)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
