import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { minimalDirectConversation, minimalGroupConversation } from "../../../__mocks__/fixtures/conversation.fixtures";
import { getAdapters } from "@adapters";
import { CHAT_CONTENT_TABS } from "@utils/constants";
import { ConversationHeader } from "./ConversationHeader";

const baseProps: ComponentProps<typeof ConversationHeader> = {
  conversation: minimalDirectConversation,
  isSelectionMode: false,
  currentTab: CHAT_CONTENT_TABS.MESSAGES,
  changeTabFunc: vi.fn(),
  closeFormFunc: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof ConversationHeader>> = {}) =>
  render(<ConversationHeader {...baseProps} {...props} />);

describe("ConversationHeader", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    (getAdapters().useMessages().getSelectedMessages as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      countOfSelectedMessages: 0,
      midsArrayOfSelectedMessages: [],
    }));
  });

  describe("rendering", () => {
    it("should show opponent full name for a direct chat", () => {
      renderComponent();
      expect(screen.getByText("FirstName2 LastName2")).toBeVisible();
    });

    it("should show the explicit group name for group chats", () => {
      const conv = { ...minimalGroupConversation, participants: ["u1", "u2"] as string[] };
      renderComponent({ conversation: conv });
      expect(screen.getByText("Team chat")).toBeVisible();
    });

    it("should surface the apps toggle for group owners", () => {
      const conv = { ...minimalGroupConversation, participants: ["u1", "u2"] as string[] };
      renderComponent({ conversation: conv });
      expect(screen.getByTestId("icon-code")).toBeInTheDocument();
    });

    it("should merge className onto the root", () => {
      const { container } = renderComponent({ className: "header-shell" });
      expect(container.firstElementChild).toHaveClass("header-shell");
    });
  });

  describe("user interaction", () => {
    it("should call closeFormFunc when the back button is pressed", async () => {
      const closeFormFunc = vi.fn();
      renderComponent({ closeFormFunc });
      await user.click(screen.getByTestId("icon-chevron-left").closest("button")!);
      expect(closeFormFunc).toHaveBeenCalledTimes(1);
    });

    it("should call changeTabFunc when the code/apps toggle is used", async () => {
      const changeTabFunc = vi.fn();
      const conv = { ...minimalGroupConversation, participants: ["u1", "u2"] as string[] };
      renderComponent({ conversation: conv, changeTabFunc });
      await user.click(screen.getByTestId("icon-code").closest("button")!);
      expect(changeTabFunc).toHaveBeenCalledWith(CHAT_CONTENT_TABS.APPS);
    });

    it("should forward openContextMenu when the overflow control is activated", async () => {
      const openContextMenu = getAdapters().useContextMenu().openContextMenu as ReturnType<typeof vi.fn>;
      renderComponent();
      await user.click(screen.getByTestId("icon-ellipsis-vertical").closest("button")!);
      expect(openContextMenu).toHaveBeenCalled();
    });

    it("should call onOpenChatOrParticipantInfo when the title stack is clicked", async () => {
      const onOpenChatOrParticipantInfo = vi.fn();
      renderComponent({ onOpenChatOrParticipantInfo });
      await user.click(screen.getByText("FirstName2 LastName2"));
      expect(onOpenChatOrParticipantInfo).toHaveBeenCalled();
    });

    it("should run selection-mode actions", async () => {
      const onForwardSection = vi.fn();
      const onCloseSelectionMode = vi.fn();
      const deleteSelectedMessages = getAdapters().useMessages().deleteSelectedMessages as ReturnType<typeof vi.fn>;
      const getSelectedMessages = getAdapters().useMessages().getSelectedMessages as ReturnType<typeof vi.fn>;
      getSelectedMessages.mockReturnValueOnce({
        countOfSelectedMessages: 2,
        midsArrayOfSelectedMessages: ["a", "b"],
      });

      renderComponent({
        isSelectionMode: true,
        onForwardSection,
        onCloseSelectionMode,
      });

      await user.click(screen.getByRole("button", { name: /Forward/i }));
      expect(onForwardSection).toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /Delete/i }));
      expect(deleteSelectedMessages).toHaveBeenCalledWith(minimalDirectConversation._id, ["a", "b"]);

      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onCloseSelectionMode).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should render when onOpenChatOrParticipantInfo is omitted", () => {
      expect(() => renderComponent({ onOpenChatOrParticipantInfo: undefined })).not.toThrow();
      expect(screen.getByText("FirstName2 LastName2")).toBeVisible();
    });
  });
});
