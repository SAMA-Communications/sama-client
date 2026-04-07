import { createRef } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { MessageInputProps } from "./MessageInput.type";
import { MessageInput } from "./MessageInput";

const inputTextRef = createRef<HTMLTextAreaElement>();

const defaultProps: MessageInputProps = {
  inputTextRef,
  isBlockedConv: false,
  isEditAction: false,
  isMobile: false,
  isSending: false,
  isEnableMagicButton: false,
  onSubmitFunc: vi.fn() as MessageInputProps["onSubmitFunc"],
};

const renderComponent = (props: Partial<MessageInputProps> = {}) =>
  render(<MessageInput {...defaultProps} {...props} />);

describe("MessageInput", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render compose controls", () => {
      renderComponent();
      expect(screen.getByPlaceholderText("Type your message...")).toBeVisible();
      expect(screen.getByTestId("icon-paperclip")).toBeInTheDocument();
      expect(screen.getByTestId("icon-send")).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should call onSubmitFunc when send is clicked", async () => {
      const onSubmitFunc = vi.fn() as MessageInputProps["onSubmitFunc"];
      const ref = createRef<HTMLTextAreaElement>();
      renderComponent({ inputTextRef: ref, onSubmitFunc });
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[buttons.length - 1]);
      expect(onSubmitFunc).toHaveBeenCalled();
    });
  });
});
