import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { minimalGroupConversation } from "../../../__mocks__/fixtures/conversation.fixtures";
import { getAdapters } from "@adapters";
import { ConfirmWindowProvider } from "@src/hooks/useConfirmWindow";
import { ConversationInfo } from "./ConversationInfo";

const groupWithMembers = {
  ...minimalGroupConversation,
  participants: ["u1", "u2"] as string[],
  description: "About this group",
};

const defaultProps: ComponentProps<typeof ConversationInfo> = {
  conversation: groupWithMembers,
  isMobile: false,
  onClose: vi.fn(),
  onEditConversation: vi.fn(),
  onAddParticipants: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof ConversationInfo>> = {}) =>
  render(
    <ConfirmWindowProvider>
      <ConversationInfo {...defaultProps} {...props} />
    </ConfirmWindowProvider>,
  );

describe("ConversationInfo", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show group title, description, and member strip", () => {
      renderComponent();
      expect(screen.getByText("Team chat")).toBeVisible();
      expect(screen.getByText("About this group")).toBeVisible();
      expect(screen.getByText("2 members")).toBeVisible();
      expect(screen.getByText("Edit Group Info")).toBeVisible();
    });

    it("should not render main chrome when conversation is null", () => {
      renderComponent({ conversation: null as any });
      expect(screen.queryByText("Leave Group")).not.toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should call onClose from the header control", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose });
      await user.click(screen.getByTestId("icon-x").closest("button")!);
      expect(onClose).toHaveBeenCalled();
    });

    it("should call onEditConversation when owner taps edit link", async () => {
      const onEditConversation = vi.fn();
      renderComponent({ onEditConversation });
      await user.click(screen.getByText("Edit Group Info"));
      expect(onEditConversation).toHaveBeenCalled();
    });

    it("should call onAddParticipants from the add control", async () => {
      const onAddParticipants = vi.fn();
      renderComponent({ onAddParticipants });
      await user.click(screen.getByTestId("icon-user-plus").closest("button")!);
      expect(onAddParticipants).toHaveBeenCalled();
    });

    it("should call deleteAndLeave after confirming leave", async () => {
      const deleteAndLeave = getAdapters().useConversations().deleteAndLeave as ReturnType<typeof vi.fn>;
      renderComponent();
      await user.click(screen.getByText("Leave Group"));
      expect(await screen.findByText("Delate And Leave")).toBeVisible();
      await user.click(screen.getByRole("button", { name: "Confirm" }));
      expect(deleteAndLeave).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should render without optional participant handlers", () => {
      expect(() =>
        renderComponent({
          onParticipantOpenProfile: undefined,
          onParticipantContextMenu: undefined,
        }),
      ).not.toThrow();
      expect(screen.getByText("Team chat")).toBeVisible();
    });
  });
});
