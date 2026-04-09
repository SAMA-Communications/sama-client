import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { TypingLine } from "./TypingLine";

const defaultProps: ComponentProps<typeof TypingLine> = {
  typingUserIds: ["u1"],
};

const renderComponent = (props: Partial<ComponentProps<typeof TypingLine>> = {}) =>
  render(<TypingLine {...defaultProps} {...props} />);

describe("TypingLine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders dots loader", () => {
      renderComponent();
      const loader = screen.getByTestId("dots-loader");
      expect(loader).toBeInTheDocument();
      expect(loader).toHaveAttribute("data-height", "22");
      expect(loader).toHaveAttribute("data-width", "16");
    });

    it("renders only 'typing' when isDisplayUserNames = false", () => {
      renderComponent();
      const p = screen.getByText(/typing/i);
      expect(p.textContent).toBe("typing");
    });

    it("renders single username when isDisplayUserNames = true", () => {
      renderComponent({ isDisplayUserNames: true });
      expect(screen.getByText("FirstName1 typing")).toBeInTheDocument();
    });

    it("renders two usernames correctly", () => {
      renderComponent({ typingUserIds: ["u1", "u2"], isDisplayUserNames: true });
      expect(screen.getByText("FirstName1, FirstName2 typing")).toBeInTheDocument();
    });

    it("renders 'and N more' when more than two users", () => {
      renderComponent({ typingUserIds: ["u1", "u2", "u3"], isDisplayUserNames: true });
      expect(screen.getByText("FirstName1 and 2 more typing")).toBeInTheDocument();
    });

    it("should merge custom className on root", () => {
      const { container } = renderComponent({ className: "ui:opacity-90" });
      expect(container.firstElementChild).toHaveClass("ui:opacity-90");
    });
  });
});
