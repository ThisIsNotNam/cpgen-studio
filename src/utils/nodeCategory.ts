import type { FieldKind } from "../types";

export type NodeCategory = "primitive" | "collection" | "control";

export interface NodeCategoryColor {
  border: string;
  soft: string;
  accent: string;
}

export const NODE_KIND_TO_CATEGORY: Record<FieldKind, NodeCategory> = {
  int: "primitive",
  float: "primitive",
  string: "primitive",
  array: "collection",
  loop: "control",
};

export const NODE_CATEGORY_COLORS: Record<NodeCategory, NodeCategoryColor> = {
  primitive: {
    border: "#60a5fa",
    soft: "rgba(96, 165, 250, 0.14)",
    accent: "#93c5fd",
  },
  collection: {
    border: "#a78bfa",
    soft: "rgba(167, 139, 250, 0.14)",
    accent: "#c4b5fd",
  },
  control: {
    border: "#fbbf24",
    soft: "rgba(251, 191, 36, 0.15)",
    accent: "#fcd34d",
  },
};

export const getNodeKindMeta = (kind: FieldKind) => {
  const category = NODE_KIND_TO_CATEGORY[kind];
  const color = NODE_CATEGORY_COLORS[category];

  return {
    kind,
    category,
    color,
  };
};
