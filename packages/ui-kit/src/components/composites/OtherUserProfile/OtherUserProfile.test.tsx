import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/participants.mock";
import { OtherUserProfile } from "./OtherUserProfile";

const defaultProps: ComponentProps<typeof OtherUserProfile> = {
  user: participantsMock.u2,
  displayName: "Colleague",
  onClose: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof OtherUserProfile>> = {}) =>
  render(<OtherUserProfile {...defaultProps} {...props} />);

describe("OtherUserProfile", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render card view by default", () => {
      renderComponent();
      expect(screen.getByText("Colleague")).toBeVisible();
      expect(screen.getByText("Personal information")).toBeVisible();
    });

    it("should render compact view when view is compact", () => {
      renderComponent({ view: "compact" });
      expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    });

    it("should merge className onto the root", () => {
      const { container } = renderComponent({ className: "profile-shell" });
      expect(container.firstElementChild).toHaveClass("profile-shell");
    });
  });

  describe("user interaction", () => {
    it("should call onClose from the close control in card mode", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose });
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should prefer onBack on mobile compact layout", async () => {
      const onBack = vi.fn();
      renderComponent({ view: "compact", isMobile: true, onBack });
      await user.click(screen.getByRole("button", { name: "Back" }));
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should render without optional conversation starter", () => {
      expect(() => renderComponent({ onStartConversation: undefined })).not.toThrow();
    });
  });
});
