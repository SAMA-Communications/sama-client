import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { OvalLoader } from "./OvalLoader";

const defaultProps: ComponentProps<typeof OvalLoader> = {};

const renderComponent = (props: Partial<ComponentProps<typeof OvalLoader>> = {}) =>
  render(<OvalLoader {...defaultProps} {...props} />);

describe("OvalLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render wrapper with provided className", () => {
      renderComponent({ wrapperClassName: "custom-wrapper" });
      const wrapper = screen.getByTestId("oval-loader");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("custom-wrapper");
    });

    it("should render Oval component with default props", () => {
      renderComponent();
      const oval = screen.getByTestId("mock-oval");
      expect(oval).toBeInTheDocument();
      expect(oval).toHaveAttribute("data-height", "32");
      expect(oval).toHaveAttribute("data-width", "32");
      expect(oval).toHaveAttribute("data-color", "#ffffff");
      expect(oval).toHaveAttribute("data-secondary-color", "#a0a0a0");
    });

    it("should render Oval component with custom props", () => {
      renderComponent({ height: 50, width: 60, color: "red" });
      const oval = screen.getByTestId("mock-oval");
      expect(oval).toHaveAttribute("data-height", "50");
      expect(oval).toHaveAttribute("data-width", "60");
      expect(oval).toHaveAttribute("data-color", "red");
    });
  });
});
