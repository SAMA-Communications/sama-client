import React from "react";
import { vi } from "vitest";

/**
 * `motion/react-m` forwards many motion-only props to a real `div`.
 * Motion-specific props are stripped so React does not warn on unknown DOM attributes.
 */
vi.mock("motion/react-m", () => ({
  div: (props: Record<string, unknown> & { children?: React.ReactNode }) => {
    const { children, drag, dragDirectionLock, dragConstraints, whileTap, whileDrag, ...rest } = props;
    return React.createElement("div", rest as React.HTMLAttributes<HTMLDivElement>, children);
  },
}));
