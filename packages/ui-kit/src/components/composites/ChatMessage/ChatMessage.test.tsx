import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  attachmentsSlot,
  chatMessageMessagesMock,
  linkPreviewSlot,
  participantsMock,
} from "../../../__mocks__/fixtures/chatMessage.fixtures";
import { ChatMessage } from "./ChatMessage";

const [baseMessage] = chatMessageMessagesMock;
const forwardedMessage = chatMessageMessagesMock.find((m) => m.forwarded_message_id)!;
const editedMessage = chatMessageMessagesMock.find((m) => m._id === "m-edited")!;
const messageWithAttachments = chatMessageMessagesMock[1];

const defaultProps = {
  message: baseMessage,
  sender: participantsMock.u1,
  isCurrentUser: false,
  bodyContent: <span>{baseMessage.body ?? "Hello!"}</span>,
};

const renderComponent = (props: Partial<ComponentProps<typeof ChatMessage>> = {}) =>
  render(<ChatMessage {...defaultProps} {...props} />);

describe("ChatMessage", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render correctly with required props", () => {
      renderComponent();
      expect(screen.getByText("Hello!")).toBeVisible();
      expect(screen.getByText("Hello!").closest("[data-message-id]")).toHaveAttribute("data-message-id", "m1");
    });

    it("should render body and attachment slot when message has attachments", () => {
      renderComponent({
        message: messageWithAttachments,
        bodyContent: <span>{messageWithAttachments.body}</span>,
        attachmentsNode: attachmentsSlot,
      });
      expect(screen.getByTestId("attachments-slot")).toBeVisible();
    });

    it("should render link preview when message has no attachments", () => {
      renderComponent({ linkPreviewNode: linkPreviewSlot });
      expect(screen.getByTestId("link-preview-slot")).toBeVisible();
    });
  });

  describe("props and conditional rendering", () => {
    it("should show author name when previous message is not from same sender", () => {
      renderComponent({ senderDisplayName: "John Doe", isPrevMessageYours: false });
      expect(screen.getByText(/\s*John Doe/)).toBeVisible();
    });

    it("should show fallback label when author name is empty", () => {
      renderComponent({ senderDisplayName: "", isPrevMessageYours: false });
      expect(screen.getByText(/\s*Deleted account/)).toBeVisible();
    });

    it("should hide author row when previous message is from same sender", () => {
      renderComponent({ senderDisplayName: "John Doe", isPrevMessageYours: true });
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });

    it("should respect showAuthor override", () => {
      renderComponent({
        senderDisplayName: "Jane",
        isPrevMessageYours: false,
        showAuthor: false,
      });
      expect(screen.queryByText("Jane")).not.toBeInTheDocument();

      renderComponent({
        senderDisplayName: "Jane",
        isPrevMessageYours: true,
        showAuthor: true,
      });
      expect(screen.getAllByText(/\s*Jane/).length).toBeGreaterThan(0);
    });

    it("should show forwarded label for forwarded messages", () => {
      renderComponent({
        message: forwardedMessage,
        bodyContent: <span>{forwardedMessage.body}</span>,
      });
      expect(screen.getByText("Forwarded")).toBeVisible();
    });

    it("should show edited label when timestamps differ", () => {
      renderComponent({
        message: editedMessage,
        bodyContent: <span>{editedMessage.body}</span>,
      });
      expect(screen.getByText("edited")).toBeVisible();
    });

    it("should show sent time when message ends a group or showTimestamp is true", () => {
      renderComponent({ isNextMessageYours: false });
      expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeVisible();

      renderComponent({
        isNextMessageYours: true,
        isLongTimeBetweenMessages: false,
        showTimestamp: true,
      });
      expect(screen.getAllByText(/\d{1,2}:\d{2}/).length).toBeGreaterThan(0);
    });

    it("should hide time when showTimestamp is false and message is not edited", () => {
      renderComponent({ isNextMessageYours: false, showTimestamp: false });
      expect(screen.queryByText(/\d{1,2}:\d{2}/)).not.toBeInTheDocument();
    });

    it("should align outgoing messages to the end and incoming to the start", () => {
      const { container: outgoing } = renderComponent({ isCurrentUser: true });
      expect(outgoing.firstElementChild).toHaveClass("ui:justify-end");

      const { container: incoming } = renderComponent({ isCurrentUser: false });
      expect(incoming.firstElementChild).toHaveClass("ui:justify-start");
    });

    it("should merge className onto the root", () => {
      const { container } = renderComponent({ className: "custom-root" });
      expect(container.firstElementChild).toHaveClass("custom-root");
    });

    it("should show selection affordance and check when in selection mode", () => {
      const { container: unselected } = renderComponent({
        isSelectionMode: true,
        isSelected: false,
      });
      expect(
        unselected.querySelector('span[class*="rounded-full"][class*="border"]'),
      ).toBeInTheDocument();

      renderComponent({ isSelectionMode: true, isSelected: true });
      expect(screen.getByTestId("icon-check")).toBeVisible();
    });

    it("should not render profile avatar buttons when hideUserIcon is true", () => {
      const { container } = renderComponent({ hideUserIcon: true });
      expect(container.querySelectorAll('button[type="button"]')).toHaveLength(0);
    });
  });

  describe("user interaction", () => {
    it("should call onUserProfile with sender id when author row is clicked", async () => {
      const onUserProfile = vi.fn();
      renderComponent({
        senderDisplayName: "John",
        isPrevMessageYours: false,
        onUserProfile,
      });
      await user.click(screen.getByText(/\s*John/));
      expect(onUserProfile).toHaveBeenCalledWith("u1");
    });

    it("should call onContextMenu from the message root", async () => {
      const onContextMenu = vi.fn();
      const { container } = renderComponent({ onContextMenu });
      const root = container.firstElementChild as HTMLElement;
      await user.pointer({ keys: "[MouseRight>]", target: within(root).getByText("Hello!") });
      expect(onContextMenu).toHaveBeenCalled();
    });

    it("should call onSelectClick when tapping message body in selection mode", async () => {
      const onSelectClick = vi.fn();
      const { container } = renderComponent({
        isSelectionMode: true,
        isSelected: false,
        onSelectClick,
      });
      const root = container.firstElementChild as HTMLElement;
      await user.click(within(root).getByText("Hello!"));
      expect(onSelectClick).toHaveBeenCalledTimes(1);
    });

    it("should call onUnselectClick when tapping selected message in selection mode", async () => {
      const onUnselectClick = vi.fn();
      const { container } = renderComponent({
        isSelectionMode: true,
        isSelected: true,
        onUnselectClick,
      });
      const root = container.firstElementChild as HTMLElement;
      await user.click(within(root).getByText("Hello!"));
      expect(onUnselectClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should render without optional callbacks", () => {
      expect(() =>
        renderComponent({
          onUserProfile: undefined,
          onContextMenu: undefined,
          onSelectClick: undefined,
        }),
      ).not.toThrow();
      expect(screen.getByText("Hello!")).toBeVisible();
    });

    it("should treat null sender like missing profile data without crashing", () => {
      expect(() => renderComponent({ sender: null })).not.toThrow();
      expect(screen.getByText("Hello!")).toBeVisible();
    });
  });
});
