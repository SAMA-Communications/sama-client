import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/participants.mock";
import { OtherUserProfileViewCompact } from "./OtherUserProfileViewCompact";

const defaultProps: ComponentProps<typeof OtherUserProfileViewCompact> = {
  user: participantsMock.u2,
  displayName: "Compact user",
  onAction: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof OtherUserProfileViewCompact>> = {}) =>
  render(<OtherUserProfileViewCompact {...defaultProps} {...props} />);

describe("OtherUserProfileViewCompact", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show the display name", () => {
      renderComponent();
      expect(screen.getByText("Compact user")).toBeVisible();
    });

    it("should render optional status copy", () => {
      renderComponent({ statusActivity: "Away" });
      expect(screen.getByText("Away")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onAction from the back affordance", async () => {
      const onAction = vi.fn();
      renderComponent({ onAction });
      await user.click(screen.getByRole("button", { name: "Back" }));
      expect(onAction).toHaveBeenCalledTimes(1);
    });
  });
});
