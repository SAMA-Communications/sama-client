import type { ComponentProps, RefObject } from "react";
import { createRef } from "react";

import type { Conversation } from "types/samaWssModels";
import userEvent from "@testing-library/user-event";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { overrideSelectedConversation, resetUseConversationsAdapter } from "../../../__mocks__/fixtures/adapterTestUtils";
import { getAdapters } from "@adapters";
import { ConversationInput } from "./ConversationInput";

const chatMessagesBlockRef = createRef<HTMLDivElement>() as RefObject<HTMLDivElement>;

const defaultProps: ComponentProps<typeof ConversationInput> = {
  chatMessagesBlockRef,
};

const renderComponent = (props: Partial<ComponentProps<typeof ConversationInput>> = {}) =>
  render(<ConversationInput {...defaultProps} {...props} />);

describe("ConversationInput", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    resetUseConversationsAdapter();
  });

  afterEach(() => {
    cleanup();
    resetUseConversationsAdapter();
  });

  describe("rendering", () => {
    it("should render MessageInput when the direct chat is not blocked", () => {
      renderComponent();
      expect(screen.getByPlaceholderText("Type your message...")).toBeVisible();
    });

    it("should show the deleted-account copy instead of the composer for blocked direct chats", () => {
      overrideSelectedConversation(
        () =>
          ({
            _id: "blocked-cid",
            type: "u",
            owner_id: "u1",
            opponent_id: "missing-opponent",
          }) as Conversation,
      );
      renderComponent();
      expect(
        screen.getByText(/The user you are currently chatting with has deleted their account/i),
      ).toBeVisible();
      expect(screen.queryByPlaceholderText("Type your message...")).not.toBeInTheDocument();
    });

    it("should merge className onto the root", () => {
      const { container } = renderComponent({ className: "compose-shell" });
      expect(container.firstElementChild).toHaveClass("compose-shell");
    });
  });

  describe("user interaction", () => {
    it("should invoke createAndSendMessage when the user sends via the send control", async () => {
      const createAndSendMessage = getAdapters().useMessages().createAndSendMessage as ReturnType<typeof vi.fn>;
      renderComponent();
      const input = screen.getByPlaceholderText("Type your message...");
      await user.type(input, "Hello");
      const sendBtn = screen.getByTestId("icon-send").closest("button");
      expect(sendBtn).toBeTruthy();
      await user.click(sendBtn!);
      await waitFor(() => expect(createAndSendMessage).toHaveBeenCalled());
      await act(async () => {
        await new Promise((r) => setTimeout(r, 60));
      });
    });

    it("should call onOpenAttachmentHub when MessageInput triggers it", async () => {
      const onOpenAttachmentHub = vi.fn();
      renderComponent({ onOpenAttachmentHub });
      const paperclip = screen.getByTestId("icon-paperclip").closest("button");
      expect(paperclip).toBeTruthy();
      await user.click(paperclip!);
      expect(onOpenAttachmentHub).toHaveBeenCalledTimes(1);
    });
  });

  describe("props and edit mode", () => {
    it("should show the confirm icon when editedMessage is set (edit action)", () => {
      renderComponent({
        editedMessage: { _id: "mid-1", body: "Old text" },
      });
      expect(screen.getByPlaceholderText("Type your message...")).toBeVisible();
      expect(screen.getByTestId("icon-check")).toBeVisible();
      expect(screen.queryByTestId("icon-send")).not.toBeInTheDocument();
    });

    it("should seed the textarea from editedMessage.body on first mount", () => {
      renderComponent({
        editedMessage: { _id: "mid-1", body: "Draft from edit" },
      });
      expect(screen.getByPlaceholderText("Type your message...")).toHaveValue("Draft from edit");
    });
  });

  describe("edge cases", () => {
    it("should render when optional attachment props are omitted", () => {
      renderComponent({
        onOpenAttachmentHub: undefined,
        isLocationIncludeAttach: undefined,
      });
      expect(screen.getByPlaceholderText("Type your message...")).toBeVisible();
    });

    it("should hide the magic button when isEnableMagicButton is false", () => {
      renderComponent({ isEnableMagicButton: false });
      expect(screen.queryByTestId("icon-sparkles")).not.toBeInTheDocument();
    });
  });
});
