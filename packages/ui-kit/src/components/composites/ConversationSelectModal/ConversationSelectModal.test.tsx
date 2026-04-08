import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ConversationSelectModal } from "./ConversationSelectModal";

const defaultProps: ComponentProps<typeof ConversationSelectModal> = {
  title: "Forward to",
  onClose: vi.fn(),
  children: <li>Chat A</li>,
};

const renderComponent = (props: Partial<ComponentProps<typeof ConversationSelectModal>> = {}) =>
  render(<ConversationSelectModal {...defaultProps} {...props} />);

describe("ConversationSelectModal", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render as a dialog with title and body", () => {
      renderComponent();
      expect(screen.getByRole("dialog")).toBeVisible();
      expect(screen.getByText("Forward to")).toBeVisible();
      expect(screen.getByText("Chat A")).toBeVisible();
    });

    it("should render optional topContent above the scroll region", () => {
      renderComponent({ topContent: <p>Filter hint</p> });
      expect(screen.getByText("Filter hint")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onClose when the header close control is used", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose });
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should render children inside the scrollbar region", () => {
      renderComponent({ children: <div data-testid="inner">List</div> });
      expect(screen.getByTestId("inner")).toBeVisible();
    });
  });
});
