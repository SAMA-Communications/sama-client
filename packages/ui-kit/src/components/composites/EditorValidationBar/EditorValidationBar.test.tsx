import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { EditorValidationBar } from "./EditorValidationBar";

const defaultProps: ComponentProps<typeof EditorValidationBar> = {
  statusNode: <span>OK</span>,
  tooltipId: "editor-val-tip",
  tooltipContent: "Details",
  onCheck: vi.fn(),
  onSave: vi.fn(),
  saveDisabled: false,
};

const renderComponent = (props: Partial<ComponentProps<typeof EditorValidationBar>> = {}) =>
  render(<EditorValidationBar {...defaultProps} {...props} />);

describe("EditorValidationBar", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show the status node and wire tooltip content", () => {
      renderComponent();
      expect(screen.getByText("OK")).toBeVisible();
      expect(screen.getByTestId("react-tooltip")).toHaveAttribute("data-tooltip-id", "editor-val-tip");
    });

    it("should disable Save when saveDisabled is true", () => {
      renderComponent({ saveDisabled: true });
      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    });
  });

  describe("user interaction", () => {
    it("should invoke onCheck and onSave from the toolbar buttons", async () => {
      const onCheck = vi.fn();
      const onSave = vi.fn();
      renderComponent({ onCheck, onSave });
      await user.click(screen.getByRole("button", { name: "Check" }));
      await user.click(screen.getByRole("button", { name: "Save" }));
      expect(onCheck).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });
});
