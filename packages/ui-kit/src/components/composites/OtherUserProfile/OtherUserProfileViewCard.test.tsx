import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/participants.mock";
import { OtherUserProfileViewCard } from "./OtherUserProfileViewCard";

const defaultProps: ComponentProps<typeof OtherUserProfileViewCard> = {
  user: participantsMock.u2,
  displayName: "Peer",
  onAction: vi.fn(),
  isMobile: false,
};

const renderComponent = (props: Partial<ComponentProps<typeof OtherUserProfileViewCard>> = {}) =>
  render(<OtherUserProfileViewCard {...defaultProps} {...props} />);

describe("OtherUserProfileViewCard", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show the display name and personal information section", () => {
      renderComponent();
      expect(screen.getByText("Peer")).toBeVisible();
      expect(screen.getByText("Personal information")).toBeVisible();
    });

    it("should render status line when provided", () => {
      renderComponent({ statusActivity: "Last seen today" });
      expect(screen.getByText("Last seen today")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onAction from the close control", async () => {
      const onAction = vi.fn();
      renderComponent({ onAction });
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it("should call onStartConversation from the accent row", async () => {
      const onStartConversation = vi.fn();
      renderComponent({ onStartConversation });
      await user.click(screen.getByText("Start a conversation"));
      expect(onStartConversation).toHaveBeenCalledTimes(1);
    });
  });
});
