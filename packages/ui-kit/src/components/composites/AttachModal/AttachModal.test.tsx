import type { ComponentProps } from "react";
import { createRef } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { AttachModal } from "./AttachModal";

const defaultCallbacks = {
  onRemoveFile: vi.fn(),
  onSend: vi.fn(),
  onCancel: vi.fn(),
  onAddMore: vi.fn(),
};

const defaultProps: ComponentProps<typeof AttachModal> = {
  files: [],
  ...defaultCallbacks,
};

const renderComponent = (props: Partial<ComponentProps<typeof AttachModal>> = {}) =>
  render(<AttachModal {...defaultProps} {...props} />);

describe("AttachModal", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show the empty state when there are no files", () => {
      renderComponent();
      expect(screen.getByText("Select files")).toBeVisible();
    });

    it("should merge className when provided", () => {
      const { container } = renderComponent({ className: "attach-shell" });
      expect(container.firstElementChild).toHaveClass("attach-shell");
    });
  });

  describe("user interaction", () => {
    it("should call onCancel from the footer", async () => {
      const onCancel = vi.fn();
      renderComponent({ onCancel });
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("refs and wiring", () => {
    it("should assign the textarea ref when inputRef is passed", () => {
      const inputRef = createRef<HTMLTextAreaElement>();
      renderComponent({ inputRef });
      expect(inputRef.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });
});
