import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { participantsMock } from "../../../__mocks__/fixtures/users.fixtures";
import { UserInfo } from "./UserInfo";

const defaultProps: ComponentProps<typeof UserInfo> = {
  user: participantsMock.u1,
  onRemove: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof UserInfo>> = {}) =>
  render(<UserInfo {...defaultProps} {...props} />);

describe("UserInfo", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render full name", () => {
      renderComponent();
      expect(screen.getByText("FirstName1 LastName1")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onRemove when clicked", async () => {
      const onRemove = vi.fn();
      renderComponent({ onRemove });
      await user.click(screen.getByText("FirstName1 LastName1"));
      expect(onRemove).toHaveBeenCalled();
    });
  });
});
