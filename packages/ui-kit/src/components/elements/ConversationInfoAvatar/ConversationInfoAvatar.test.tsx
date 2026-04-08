import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { getAdapters } from "@adapters";
import { minimalGroupConversation } from "../../../__mocks__/fixtures/conversation.fixtures";
import { ConversationInfoAvatar } from "./ConversationInfoAvatar";

const conversationNoImage = {
  ...minimalGroupConversation,
  image_url: undefined,
  image_object: undefined,
};

const defaultProps: ComponentProps<typeof ConversationInfoAvatar> = {
  conversation: conversationNoImage,
  isEditDisabled: false,
};

const renderComponent = (props: Partial<ComponentProps<typeof ConversationInfoAvatar>> = {}) =>
  render(<ConversationInfoAvatar {...defaultProps} {...props} />);

describe("ConversationInfoAvatar", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should show the group image placeholder when the chat has no custom avatar", () => {
      renderComponent();
      expect(screen.getByTestId("icon-image")).toBeInTheDocument();
    });

    it("should hide the camera affordance when edits are disabled", () => {
      renderComponent({ isEditDisabled: true });
      expect(screen.queryByTestId("icon-camera")).not.toBeInTheDocument();
    });

    it("should show the camera control when edits are allowed", () => {
      renderComponent({ isEditDisabled: false });
      expect(screen.getByTestId("icon-camera")).toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("should merge className onto the root", () => {
      const { container } = renderComponent({ className: "ui:opacity-80" });
      expect(container.firstElementChild).toHaveClass("ui:opacity-80");
    });
  });

  describe("user interaction", () => {
    it("should expose a hidden file input and keep it after activating the camera control", async () => {
      const { container } = renderComponent();
      const root = container.firstElementChild as HTMLElement;
      const input = root.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.type).toBe("file");
      await user.click(screen.getByTestId("icon-camera"));
      expect(root.contains(input)).toBe(true);
    });

    it("should call updateChatImage with the chosen file", async () => {
      const updateChatImage = getAdapters().useConversations().updateChatImage as ReturnType<typeof vi.fn>;
      const { container } = renderComponent();
      const root = container.firstElementChild as HTMLElement;
      const input = root.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(["x"], "group.png", { type: "image/png" });
      await user.upload(input, file);
      await waitFor(() => expect(updateChatImage).toHaveBeenCalledWith(file));
    });
  });
});
