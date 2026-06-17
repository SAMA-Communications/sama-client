import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { EditorCodePanel } from "./EditorCodePanel";

const defaultProps: ComponentProps<typeof EditorCodePanel> = {
  statusText: "saved",
  children: <textarea aria-label="Code" />,
};

const renderComponent = (props: Partial<ComponentProps<typeof EditorCodePanel>> = {}) =>
  render(<EditorCodePanel {...defaultProps} {...props} />);

describe("EditorCodePanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render children and the status caption", () => {
      renderComponent();
      expect(screen.getByLabelText("Code")).toBeVisible();
      expect(screen.getByText(/Recent changes - saved/)).toBeVisible();
    });

    it("should merge className onto the root", () => {
      const { container } = renderComponent({ className: "code-shell" });
      expect(container.firstElementChild).toHaveClass("code-shell");
    });
  });
});
