import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ImageLoader } from "./ImageLoader";

const defaultProps: ComponentProps<typeof ImageLoader> = {};

const renderComponent = (props: Partial<ComponentProps<typeof ImageLoader>> = {}) =>
  render(<ImageLoader {...defaultProps} {...props} />);

describe("ImageLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders Blurhash with default hash", () => {
      renderComponent();
      const blurhash = screen.getByTestId("blurhash");
      expect(blurhash).toBeInTheDocument();
      expect(blurhash).toHaveAttribute("data-hash", "LEHLk~WB2yk8pyo0adR*.7kCMdnj");
    });

    it("renders Blurhash with custom hash", () => {
      renderComponent({ blurHash: "customHash123" });
      expect(screen.getByTestId("blurhash")).toHaveAttribute("data-hash", "customHash123");
    });

    it("renders OvalLoader when isShowLoader is true", () => {
      renderComponent();
      expect(screen.getByTestId("oval-loader")).toBeInTheDocument();
    });

    it("does not render OvalLoader when isShowLoader is false", () => {
      renderComponent({ isShowLoader: false });
      expect(screen.queryByTestId("oval-loader")).toBeNull();
    });
  });
});
