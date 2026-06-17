import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ContextMenuItem } from "./ContextMenuItem";

const defaultProps: ComponentProps<typeof ContextMenuItem> = {
  text: "Copy",
  icon: <span data-testid="item-icon">I</span>,
  onClick: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof ContextMenuItem>> = {}) =>
  render(<ContextMenuItem {...defaultProps} {...props} />);

describe("ContextMenuItem", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render label and icon", () => {
      renderComponent();
      expect(screen.getByRole("menuitem", { name: /Copy/ })).toBeVisible();
      expect(screen.getByTestId("item-icon")).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should call onClick when activated", async () => {
      const onClick = vi.fn();
      renderComponent({ text: "Delete", icon: undefined, onClick });
      await user.click(screen.getByRole("menuitem", { name: "Delete" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
