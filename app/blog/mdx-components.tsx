"use client";

import defaultMdxComponents from "fumadocs-ui/mdx";
import * as React from "react";

const Table = (p: React.ComponentProps<"table">) => (
  <div className="my-6 overflow-x-auto">
    <table
      {...p}
      className={`min-w-full border-collapse border text-sm ${
        p.className ?? ""
      }`}
    />
  </div>
);
const Thead = (p: React.ComponentProps<"thead">) => (
  <thead {...p} className={`bg-muted ${p.className ?? ""}`} />
);
const Th = (p: React.ComponentProps<"th">) => (
  <th
    {...p}
    className={`border px-3 py-2 text-left font-medium ${p.className ?? ""}`}
  />
);
const Td = (p: React.ComponentProps<"td">) => (
  <td {...p} className={`border px-3 py-2 align-top ${p.className ?? ""}`} />
);

export const mdxComponents = {
  ...defaultMdxComponents,
  table: Table,
  thead: Thead,
  th: Th,
  td: Td,
};
