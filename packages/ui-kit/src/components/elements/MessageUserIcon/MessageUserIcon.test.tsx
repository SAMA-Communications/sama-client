import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/fixtures/users.fixtures";
import { MessageUserIcon } from "./MessageUserIcon";

const defaultProps: ComponentProps<typeof MessageUserIcon> = {
  user: participantsMock.u1,
  isCurrentUser: false,
};

const renderComponent = (props: Partial<ComponentProps<typeof MessageUserIcon>> = {}) =>
  render(<MessageUserIcon {...defaultProps} {...props} />);

describe("MessageUserIcon", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render initials from userUtils when the user record is populated", () => {
      renderComponent();
      expect(screen.getByText("F")).toBeInTheDocument();
    });

    it("should render fallbackCurrentUser when the user is empty and this is the current user", () => {
      renderComponent({
        user: {} as (typeof participantsMock)["u1"],
        isCurrentUser: true,
        fallbackCurrentUser: <span data-testid="fb-current">FB</span>,
      });
      expect(screen.getByTestId("fb-current")).toBeInTheDocument();
    });

    it("should render fallbackOtherUser when the user is empty and this is not the current user", () => {
      renderComponent({
        user: {} as (typeof participantsMock)["u1"],
        isCurrentUser: false,
        fallbackOtherUser: <span data-testid="fb-other">FO</span>,
      });
      expect(screen.getByTestId("fb-other")).toBeInTheDocument();
    });

    it("should render the generic user glyph when no user and no fallbacks apply", () => {
      renderComponent({
        user: {} as (typeof participantsMock)["u1"],
        isCurrentUser: false,
      });
      expect(screen.getByTestId("icon-user")).toBeInTheDocument();
    });
  });
});
