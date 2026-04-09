import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/fixtures/users.fixtures";
import { SearchedUser } from "./SearchedUser";

const defaultProps: ComponentProps<typeof SearchedUser> = {
  user: participantsMock.u1,
  onClick: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof SearchedUser>> = {}) =>
  render(<SearchedUser {...defaultProps} {...props} />);

describe("SearchedUser", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render user display name", () => {
      renderComponent();
      expect(screen.getByText("FirstName1 LastName1")).toBeVisible();
    });

    it("should show check when selected", () => {
      renderComponent({ isSelected: true });
      expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should call onClick when activated", async () => {
      const onClick = vi.fn();
      renderComponent({ onClick });
      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
