import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createChatNameInputHandlers } from "../../../__mocks__/fixtures/chatNameInput.fixtures";
import { MAX_CHAT_NAME_LENGTH } from "@utils/constants";
import { ChatNameInput } from "./ChatNameInput";

const renderComponent = (
  handlers: ReturnType<typeof createChatNameInputHandlers>,
  props: Partial<ComponentProps<typeof ChatNameInput>> = {},
) => render(<ChatNameInput {...handlers} {...props} />);

describe("ChatNameInput", () => {
  let handlers: ReturnType<typeof createChatNameInputHandlers>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    handlers = createChatNameInputHandlers();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render correctly with required props", () => {
      renderComponent(handlers);
      expect(screen.getByText("Group name")).toBeVisible();
      expect(screen.getByPlaceholderText("Enter group name")).toBeVisible();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
      expect(screen.getByTestId("icon-image")).toBeVisible();
      expect(screen.getByTestId("icon-camera")).toBeVisible();
    });

    it("should merge className onto the root", () => {
      const { container } = renderComponent(handlers, { className: "custom-chat-name" });
      expect(container.firstElementChild).toHaveClass("custom-chat-name");
    });
  });

  describe("props and conditional rendering", () => {
    it("should show selected image preview after choosing a file", async () => {
      renderComponent(handlers);
      const file = new File(["x"], "avatar.png", { type: "image/png" });
      const input = document.getElementById("inputFile") as HTMLInputElement;
      await user.upload(input, file);
      const img = screen.getByRole("img", { name: "Group" });
      expect(img).toHaveAttribute("src", expect.stringMatching(/^blob:/));
    });
  });

  describe("user interaction", () => {
    it("should call onConfirm with trimmed name and null image when Continue is used", async () => {
      renderComponent(handlers);
      await user.type(screen.getByPlaceholderText("Enter group name"), "  My group  ");
      await user.click(screen.getByRole("button", { name: "Continue" }));
      expect(handlers.onConfirm).toHaveBeenCalledWith("My group", null);
      expect(handlers.onValidationError).not.toHaveBeenCalled();
    });

    it("should call onCancel when Cancel is clicked", async () => {
      renderComponent(handlers);
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(handlers.onCancel).toHaveBeenCalledTimes(1);
    });

    it("should call onValidationError and not onConfirm when name is empty", async () => {
      renderComponent(handlers);
      await user.click(screen.getByRole("button", { name: "Continue" }));
      expect(handlers.onValidationError).toHaveBeenCalledWith("Enter a name for the group chat.");
      expect(handlers.onConfirm).not.toHaveBeenCalled();
    });

    it("should call onValidationError when name is only whitespace", async () => {
      renderComponent(handlers);
      await user.type(screen.getByPlaceholderText("Enter group name"), "   ");
      await user.click(screen.getByRole("button", { name: "Continue" }));
      expect(handlers.onValidationError).toHaveBeenCalledWith("Enter a name for the group chat.");
      expect(handlers.onConfirm).not.toHaveBeenCalled();
    });

    it("should call onValidationError when name exceeds max length", async () => {
      renderComponent(handlers);
      const longName = "a".repeat(MAX_CHAT_NAME_LENGTH + 1);
      const field = screen.getByPlaceholderText("Enter group name");
      fireEvent.change(field, { target: { value: longName } });
      await user.click(screen.getByRole("button", { name: "Continue" }));
      expect(handlers.onValidationError).toHaveBeenCalledWith(
        `The length of the chat name should not exceed ${MAX_CHAT_NAME_LENGTH} characters.`,
      );
      expect(handlers.onConfirm).not.toHaveBeenCalled();
    });

    it("should submit on Enter when name is valid", async () => {
      renderComponent(handlers);
      await user.type(screen.getByPlaceholderText("Enter group name"), "Team chat");
      fireEvent.keyDown(document, { keyCode: 13 });
      expect(handlers.onConfirm).toHaveBeenCalledWith("Team chat", null);
    });

    it("should call onConfirm with image file when a file was selected", async () => {
      renderComponent(handlers);
      const file = new File(["x"], "photo.png", { type: "image/png" });
      const input = document.getElementById("inputFile") as HTMLInputElement;
      await user.upload(input, file);
      await user.type(screen.getByPlaceholderText("Enter group name"), "With avatar");
      await user.click(screen.getByRole("button", { name: "Continue" }));
      expect(handlers.onConfirm).toHaveBeenCalledWith("With avatar", file);
    });
  });

  describe("edge cases", () => {
    it("should work when onValidationError is omitted", async () => {
      const { onConfirm, onCancel } = createChatNameInputHandlers();
      render(<ChatNameInput onConfirm={onConfirm} onCancel={onCancel} />);
      await user.click(screen.getByRole("button", { name: "Continue" }));
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });
});
