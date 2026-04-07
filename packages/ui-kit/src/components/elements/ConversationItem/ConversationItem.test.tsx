import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  minimalDirectConversation,
  minimalGroupConversation,
} from "../../../__mocks__/fixtures/conversation.fixtures";
import { ConversationItem } from "./ConversationItem";

const defaultProps: ComponentProps<typeof ConversationItem> = {
  conversation: minimalDirectConversation,
  isSelected: false,
};

const renderComponent = (props: Partial<ComponentProps<typeof ConversationItem>> = {}) =>
  render(<ConversationItem {...defaultProps} {...props} />);

describe("ConversationItem", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show opponent-derived name for direct chat", () => {
      renderComponent();
      expect(screen.getByText("FirstName2 LastName2")).toBeVisible();
    });

    it("should show group name", () => {
      renderComponent({ conversation: minimalGroupConversation });
      expect(screen.getByText("Team chat")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should expose conversation id and call onClick when the row is activated", async () => {
      const onClick = vi.fn();
      const { container } = renderComponent({ isSelected: true, onClick });
      expect(container.querySelector("[data-conversation-id]")).toHaveAttribute(
        "data-conversation-id",
        "conv-d1",
      );
      await user.click(screen.getByText("FirstName2 LastName2"));
      expect(onClick).toHaveBeenCalled();
    });
  });
});
