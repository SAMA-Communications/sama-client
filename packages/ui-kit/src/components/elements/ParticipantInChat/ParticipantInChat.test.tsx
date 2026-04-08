import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/fixtures/users.fixtures";
import { ParticipantInChat } from "./ParticipantInChat";

const defaultProps: ComponentProps<typeof ParticipantInChat> = {
  user: participantsMock.u2,
  isOwner: false,
  isCurrentUserOwner: false,
  onOpenProfile: vi.fn(),
  onRequestContextMenu: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof ParticipantInChat>> = {}) =>
  render(<ParticipantInChat {...defaultProps} {...props} />);

describe("ParticipantInChat", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show participant name", () => {
      renderComponent();
      expect(screen.getByText("FirstName2 LastName2")).toBeVisible();
    });

    it("should show admin label for owner", () => {
      renderComponent({ isOwner: true });
      expect(screen.getByText("admin")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onOpenProfile with user id when another user is clicked", async () => {
      const onOpenProfile = vi.fn();
      renderComponent({ onOpenProfile });
      await user.click(screen.getByText("FirstName2 LastName2"));
      expect(onOpenProfile).toHaveBeenCalledWith("u2");
    });
  });
});
