import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { MediaBlurHash, DEFAULT_BLUR_HASH } from "./MediaBlurHash";

const defaultProps: ComponentProps<typeof MediaBlurHash> = {};

const renderComponent = (props: Partial<ComponentProps<typeof MediaBlurHash>> = {}) =>
  render(<MediaBlurHash {...defaultProps} {...props} />);

describe("MediaBlurHash", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders Blurhash with default hash if no blurHash provided", () => {
      renderComponent();
      expect(screen.getByTestId("blurhash")).toHaveAttribute("data-hash", DEFAULT_BLUR_HASH);
    });

    it("renders Blurhash with provided blurHash", () => {
      renderComponent({ blurHash: "customHash123" });
      expect(screen.getByTestId("blurhash")).toHaveAttribute("data-hash", "customHash123");
    });

    it("renders Oval loader when status is loading", () => {
      renderComponent({ status: "loading" });
      expect(screen.getByTestId("mock-oval")).toBeInTheDocument();
    });

    it("renders AlertCircle when status is error", () => {
      renderComponent({ status: "error" });
      const alert = screen.getByTestId("alert-circle");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("data-color", "#f87171");
    });

    it("passes custom loader props to Oval", () => {
      renderComponent({
        status: "loading",
        loaderSize: 60,
        loaderColor: "red",
        loaderSecondaryColor: "blue",
      });
      const oval = screen.getByTestId("mock-oval");
      expect(oval).toHaveAttribute("data-height", "60");
      expect(oval).toHaveAttribute("data-width", "60");
      expect(oval).toHaveAttribute("data-color", "red");
      expect(oval).toHaveAttribute("data-secondary-color", "blue");
    });
  });
});
