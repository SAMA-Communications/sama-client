import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ChatMessage } from "./ChatMessage";
import { chatMessageMessagesMock } from "../../../__mocks__/messages.mock";
import { participantsMock } from "../../../__mocks__/participants.mock";

vi.mock("motion/react-m", () => ({
  div: ({
    children,
    drag,
    dragDirectionLock,
    dragConstraints,
    whileTap,
    whileDrag,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
}));

const [defaultMessage] = chatMessageMessagesMock;
const defaultProps = {
  message: defaultMessage,
  sender: participantsMock.u1,
  isCurrentUser: false,
  bodyContent: <span>{defaultMessage.body ?? "Hello!"}</span>,
};

describe("ChatMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders message body content", () => {
    render(<ChatMessage {...defaultProps} />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("renders with data-message-id", () => {
    const { container } = render(<ChatMessage {...defaultProps} />);
    const messageEl = container.querySelector('[data-message-id="m1"]');
    expect(messageEl).toBeInTheDocument();
  });

  it("shows sender display name when not previous message from same sender", () => {
    render(<ChatMessage {...defaultProps} senderDisplayName="John Doe" isPrevMessageYours={false} />);
    expect(screen.getByText(/\s*John Doe/)).toBeInTheDocument();
  });

  it("shows Deleted account when sender display name is empty and not prev", () => {
    render(<ChatMessage {...defaultProps} senderDisplayName="" isPrevMessageYours={false} />);
    expect(screen.getByText(/\s*Deleted account/)).toBeInTheDocument();
  });

  it("does not show sender name when isPrevMessageYours is true", () => {
    render(<ChatMessage {...defaultProps} senderDisplayName="John Doe" isPrevMessageYours={true} />);
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("shows Forwarded label for forwarded messages", () => {
    const forwardedMessage = chatMessageMessagesMock.find((m) => m.forwarded_message_id);
    render(
      <ChatMessage {...defaultProps} message={forwardedMessage!} bodyContent={<span>{forwardedMessage!.body}</span>} />,
    );
    expect(screen.getByText("Forwarded")).toBeInTheDocument();
    expect(screen.getByTestId("icon-forward")).toBeInTheDocument();
  });

  it("shows edited label when message was edited", () => {
    const editedMessage = chatMessageMessagesMock.find((m) => m._id === "m-edited");
    render(<ChatMessage {...defaultProps} message={editedMessage!} bodyContent={<span>{editedMessage!.body}</span>} />);
    expect(screen.getByText("edited")).toBeInTheDocument();
  });

  it("shows time when isLongTimeBetweenMessages or last in group", () => {
    render(<ChatMessage {...defaultProps} isNextMessageYours={false} />);
    // Time is in a small text div next to optional "edited"
    const timeContainer = document.querySelector('[class*="text-text-dark"][class*="text-xs"]');
    expect(timeContainer).toBeInTheDocument();
  });

  it("calls onUserProfile when sender name is clicked", () => {
    const onUserProfile = vi.fn();
    render(
      <ChatMessage
        {...defaultProps}
        senderDisplayName="John"
        isPrevMessageYours={false}
        onUserProfile={onUserProfile}
      />,
    );
    fireEvent.click(screen.getByText(/\s*John/));
    expect(onUserProfile).toHaveBeenCalledWith("u1");
  });

  it("calls onContextMenu on context menu", () => {
    const onContextMenu = vi.fn();
    render(<ChatMessage {...defaultProps} onContextMenu={onContextMenu} />);
    const wrapper = screen.getByText("Hello!").closest("[data-message-id]")?.parentElement;
    if (wrapper) {
      fireEvent.contextMenu(wrapper);
      expect(onContextMenu).toHaveBeenCalled();
    }
  });

  it("shows selection checkbox when isSelectionMode is true", () => {
    const { container } = render(<ChatMessage {...defaultProps} isSelectionMode={true} isSelected={false} />);
    // When not selected, an empty circle (span with border) is shown
    const selectionCircle = container.querySelector('span[class*="rounded-full"][class*="border"]');
    expect(selectionCircle).toBeInTheDocument();
  });

  it("shows selected state when isSelected is true in selection mode", () => {
    render(<ChatMessage {...defaultProps} isSelectionMode={true} isSelected={true} />);
    expect(screen.getByTestId("icon-check")).toBeInTheDocument();
  });

  it("calls onSelectClick when clicked in selection mode and not selected", () => {
    const onSelectClick = vi.fn();
    render(<ChatMessage {...defaultProps} isSelectionMode={true} isSelected={false} onSelectClick={onSelectClick} />);
    const wrapper = screen.getByText("Hello!").closest("[data-message-id]")?.parentElement;
    if (wrapper) {
      fireEvent.click(wrapper);
      expect(onSelectClick).toHaveBeenCalled();
    }
  });

  it("calls onUnselectClick when clicked in selection mode and selected", () => {
    const onUnselectClick = vi.fn();
    render(
      <ChatMessage {...defaultProps} isSelectionMode={true} isSelected={true} onUnselectClick={onUnselectClick} />,
    );
    const wrapper = screen.getByText("Hello!").closest("[data-message-id]")?.parentElement;
    if (wrapper) {
      fireEvent.click(wrapper);
      expect(onUnselectClick).toHaveBeenCalled();
    }
  });

  it("applies className to root", () => {
    const { container } = render(<ChatMessage {...defaultProps} className="custom-root" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("custom-root");
  });

  it("renders attachmentsNode when message has attachments", () => {
    const messageWithAttachments = chatMessageMessagesMock[1]; // m2 has attachments
    const attachmentsNode = <div data-testid="attachments">Attachments here</div>;
    render(
      <ChatMessage
        {...defaultProps}
        message={messageWithAttachments}
        bodyContent={<span>{messageWithAttachments.body}</span>}
        attachmentsNode={attachmentsNode}
      />,
    );
    expect(screen.getByTestId("attachments")).toBeInTheDocument();
    expect(screen.getByText("Attachments here")).toBeInTheDocument();
  });

  it("renders linkPreviewNode when message has no attachments", () => {
    const linkPreviewNode = <div data-testid="link-preview">Link preview</div>;
    render(<ChatMessage {...defaultProps} linkPreviewNode={linkPreviewNode} />);
    expect(screen.getByTestId("link-preview")).toBeInTheDocument();
    expect(screen.getByText("Link preview")).toBeInTheDocument();
  });

  it("renders with current user alignment", () => {
    const { container } = render(<ChatMessage {...defaultProps} isCurrentUser={true} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("ui:justify-end");
  });

  it("renders with other user alignment", () => {
    const { container } = render(<ChatMessage {...defaultProps} isCurrentUser={false} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("ui:justify-start");
  });
});
