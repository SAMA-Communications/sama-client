import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { minimalDirectConversation, minimalGroupConversation } from "../../../__mocks__/fixtures/conversation.fixtures";
import { getAdapters } from "@adapters";
import { ConversationItemList } from "./ConversationItemList";

const defaultProps: ComponentProps<typeof ConversationItemList> = {
  conversations: [minimalDirectConversation, minimalGroupConversation],
  selectedConversation: minimalDirectConversation,
  /** Avoid scroll persistence + extra layout effects that schedule updates outside the first `act`. */
  disableBuiltinScrollPersistence: true,
};

const renderComponent = async (props: Partial<ComponentProps<typeof ConversationItemList>> = {}) => {
  let view: ReturnType<typeof render>;
  await act(async () => {
    view = render(<ConversationItemList {...defaultProps} {...props} />);
    await Promise.resolve();
  });
  return view!;
};

describe("ConversationItemList", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render rows inside a custom scrollbar", async () => {
      await renderComponent();
      expect(screen.getByRole("scrollbar")).toBeInTheDocument();
      expect(screen.getByText("FirstName2 LastName2")).toBeVisible();
      expect(screen.getByText("Team chat")).toBeVisible();
    });

    it("should apply selection styling to the active conversation", async () => {
      await renderComponent({
        selectedConversation: minimalDirectConversation,
        conversations: [minimalDirectConversation],
      });
      const row = document.querySelector(`[data-conversation-id="${minimalDirectConversation._id}"]`);
      expect(row).toHaveClass("ui:bg-accent-100");
    });

    it("should merge className onto the outer shell", async () => {
      const { container } = await renderComponent({ className: "list-shell" });
      expect(container.firstElementChild).toHaveClass("list-shell");
    });
  });

  describe("user interaction", () => {
    it("should call setSelectedConversation when a row is activated", async () => {
      const setSelectedConversation = getAdapters().useConversations().setSelectedConversation as ReturnType<
        typeof vi.fn
      >;
      await renderComponent({
        conversations: [minimalDirectConversation, minimalGroupConversation],
        selectedConversation: null,
      });
      await user.click(screen.getByText("Team chat"));
      expect(setSelectedConversation).toHaveBeenCalledWith(minimalGroupConversation._id);
    });
  });

  describe("edge cases", () => {
    it("should render an empty list with scrollbar chrome", async () => {
      await renderComponent({ conversations: [], selectedConversation: null });
      await waitFor(() => {
        expect(screen.getByRole("scrollbar")).toBeInTheDocument();
      });
    });
  });
});
