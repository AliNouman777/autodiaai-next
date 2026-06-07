"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Option<T extends string> = {
  value: T;
  label: string;
};

type AppSelectProps<T extends string> = {
  value: T | undefined;
  onChange: (v: T) => void;
  options: readonly Option<T>[];
  className?: string;
  placeholder?: string;
};

export function AppSelect<T extends string>({
  value,
  onChange,
  options,
  className = "w-full md:w-42 cursor-pointer border-gray-200 rounded-md",
  placeholder = "Select option",
}: AppSelectProps<T>) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
