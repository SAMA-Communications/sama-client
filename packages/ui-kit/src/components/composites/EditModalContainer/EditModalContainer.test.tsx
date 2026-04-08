import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { getAdapters } from "@adapters";
import { EditModalContainer } from "./EditModalContainer";

const defaultProps: ComponentProps<typeof EditModalContainer> = {
  type: "conversation",
  onClose: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof EditModalContainer>> = {}) =>
  render(<EditModalContainer {...defaultProps} {...props} />);

describe("EditModalContainer", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render conversation fields inside a dialog", () => {
      renderComponent({ type: "conversation" });
      expect(screen.getByRole("dialog")).toBeVisible();
      expect(screen.getByText("Chat Information")).toBeVisible();
      expect(screen.getByText("Group name")).toBeVisible();
    });

    it("should render profile fields for the user variant", () => {
      renderComponent({ type: "user" });
      expect(screen.getByText("Edit Profile")).toBeVisible();
      expect(screen.getByText("First name")).toBeVisible();
    });

    it("should merge className onto the modal root", () => {
      renderComponent({ className: "edit-shell" });
      expect(document.querySelector(".edit-shell")).toBeTruthy();
    });
  });

  describe("user interaction", () => {
    it("should call onClose when Cancel is pressed", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose });
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call updateNameAndDescription and close when Save succeeds", async () => {
      const updateNameAndDescription = getAdapters().useConversations()
        .updateNameAndDescription as ReturnType<typeof vi.fn>;
      updateNameAndDescription.mockResolvedValueOnce(true);
      const onClose = vi.fn();
      renderComponent({ type: "conversation", onClose });
      await user.click(screen.getByRole("button", { name: "Save" }));
      expect(updateNameAndDescription).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should render Save and Cancel for the user profile variant", () => {
      renderComponent({ type: "user" });
      expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
    });
  });
});
