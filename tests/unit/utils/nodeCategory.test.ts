import { describe, expect, it } from "vitest";

import {
  getNodeKindMeta,
  NODE_CATEGORY_COLORS,
  NODE_KIND_TO_CATEGORY,
} from "../../../src/utils/nodeCategory";

describe("nodeCategory", () => {
  it("groups node kinds into a single shared category map", () => {
    expect(NODE_KIND_TO_CATEGORY.int).toBe("primitive");
    expect(NODE_KIND_TO_CATEGORY.float).toBe("primitive");
    expect(NODE_KIND_TO_CATEGORY.string).toBe("primitive");
    expect(NODE_KIND_TO_CATEGORY.array).toBe("collection");
    expect(NODE_KIND_TO_CATEGORY.loop).toBe("control");

    expect(NODE_CATEGORY_COLORS.primitive).toEqual({
      border: expect.any(String),
      soft: expect.any(String),
      accent: expect.any(String),
    });
    expect(getNodeKindMeta("int").category).toBe("primitive");
    expect(getNodeKindMeta("loop").color.accent).toBe(
      NODE_CATEGORY_COLORS.control.accent,
    );
  });
});
