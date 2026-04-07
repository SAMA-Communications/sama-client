import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ContextMenu } from "./ContextMenu";

const defaultProps: ComponentProps<typeof ContextMenu> = {
  position: { x: 4, y: 8 },
  children: <span>Copy</span>,
};

const renderComponent = (props: Partial<ComponentProps<typeof ContextMenu>> = {}) =>
  render(<ContextMenu {...defaultProps} {...props} />);

describe("ContextMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should expose role=menu and render slotted children", () => {
      renderComponent();
      const menu = screen.getByRole("menu");
      expect(menu).toContainElement(screen.getByText("Copy"));
    });

    it("should position using the provided coordinates", () => {
      renderComponent({ position: { x: 100, y: 200 } });
      const menu = screen.getByRole("menu");
      expect(menu).toHaveStyle({ left: "100px", top: "200px" });
    });

    it("should merge className onto the shell", () => {
      renderComponent({ className: "ctx-extra" });
      expect(screen.getByRole("menu")).toHaveClass("ctx-extra");
    });
  });

  describe("props", () => {
    it("should merge inline style with positioned coordinates", () => {
      renderComponent({ style: { zIndex: 9 } });
      expect(screen.getByRole("menu")).toHaveStyle({ left: "4px", top: "8px", zIndex: 9 });
    });
  });
});
