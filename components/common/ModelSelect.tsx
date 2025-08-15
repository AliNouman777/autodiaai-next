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
  | "openai/gpt-oss-20b:free"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "deepseek/deepseek-chat-v3-0324:free";

const OPTIONS: { value: CanonicalModel; label: string }[] = [
  { value: "deepseek/deepseek-chat-v3-0324:free", label: "Deepseek V3" },
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
