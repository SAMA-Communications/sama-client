import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DotsLoader } from "./DotsLoader";

const defaultProps: ComponentProps<typeof DotsLoader> = {};

const renderComponent = (props: Partial<ComponentProps<typeof DotsLoader>> = {}) =>
  render(<DotsLoader {...defaultProps} {...props} />);

describe("DotsLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the three-dots indicator with default sizing and label", () => {
      renderComponent();
      const el = screen.getByTestId("dots-loader");
      expect(el).toHaveAttribute("data-height", "22");
      expect(el).toHaveAttribute("data-width", "16");
      expect(el).toHaveAttribute("aria-label", "three-dots-loading");
    });

    it("should forward custom dimensions to the spinner", () => {
      renderComponent({ height: 30, width: 20 });
      const el = screen.getByTestId("dots-loader");
      expect(el).toHaveAttribute("data-height", "30");
      expect(el).toHaveAttribute("data-width", "20");
    });
  });
});
