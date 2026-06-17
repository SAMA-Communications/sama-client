import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { minimalDirectConversation, minimalGroupConversation } from "../../../__mocks__/fixtures/conversation.fixtures";
import { SearchConversationList } from "./SearchConversationList";

const defaultProps: ComponentProps<typeof SearchConversationList> = {
  conversations: [minimalDirectConversation],
  selectedConversationId: undefined,
  onConversationClick: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof SearchConversationList>> = {}) =>
  render(<SearchConversationList {...defaultProps} {...props} />);

describe("SearchConversationList", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show the Chats heading by default", () => {
      renderComponent();
      expect(screen.getByText("Chats")).toBeVisible();
      expect(screen.getByTestId("icon-message-circle")).toBeInTheDocument();
    });

    it("should hide the heading when showTitle is false", () => {
      renderComponent({ showTitle: false, conversations: [] });
      expect(screen.queryByText("Chats")).not.toBeInTheDocument();
    });

    it("should render an empty message when provided", () => {
      renderComponent({
        conversations: [],
        emptyMessage: "Nothing matched",
      });
      expect(screen.getByText("Nothing matched")).toBeVisible();
    });

    it("should render multiple conversation rows", () => {
      renderComponent({
        conversations: [minimalDirectConversation, minimalGroupConversation],
      });
      expect(screen.getByText("FirstName2 LastName2")).toBeVisible();
      expect(screen.getByText("Team chat")).toBeVisible();
    });
  });

  describe("props and selection state", () => {
    it("should highlight the selected conversation row", () => {
      renderComponent({
        selectedConversationId: minimalDirectConversation._id,
      });
      const row = document.querySelector(`[data-conversation-id="${minimalDirectConversation._id}"]`);
      expect(row).toHaveClass("ui:bg-accent-100");
    });
  });

  describe("user interaction", () => {
    it("should call onConversationClick with the conversation id", async () => {
      const onConversationClick = vi.fn();
      renderComponent({ onConversationClick });
      await user.click(screen.getByText("FirstName2 LastName2"));
      expect(onConversationClick).toHaveBeenCalledWith(minimalDirectConversation._id);
    });
  });

  describe("edge cases", () => {
    it("should render an empty list without throwing", () => {
      expect(() => renderComponent({ conversations: [] })).not.toThrow();
    });
  });
});
