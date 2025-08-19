import type { Edge, Node } from "@xyflow/react";

export type RankDir = "LR" | "TB";

export type KeyKindUI = "" | "PK" | "FK";

export type Column = {
  id: string;
  title: string;
  type: string;
  key?: KeyKindUI;
};

export type SchemaNodeData = {
  label: string;
  schema: Column[];
  diagramId?: string;
  onNodeHover?: () => void;
  onNodeUnhover?: () => void;
  isHovered?: boolean;
  isConnected?: boolean;
};

export type HandleMap = Record<
  string,
  {
    all: Set<string>;
    defaultLeft: string | null;
    defaultRight: string | null;
  }
>;

export type Props = {
  nodes: Node[];
  edges: Edge[];
  layout?: RankDir;
  diagramId?: string; // optional prop (preferred)
};