import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { UserInputsGroup } from "./UserInputsGroup";

const defaultProps: ComponentProps<typeof UserInputsGroup> = {
  onChageValue: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof UserInputsGroup>> = {}) =>
  render(<UserInputsGroup {...defaultProps} {...props} />);

describe("UserInputsGroup", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render inputs seeded from the current user", () => {
      renderComponent();
      expect(screen.getByText("First name")).toBeVisible();
      expect(screen.getByText("Last name")).toBeVisible();
      expect(screen.getByDisplayValue("FirstName1")).toBeVisible();
      expect(screen.getByDisplayValue("LastName1")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should propagate edits via onChageValue", async () => {
      const onChageValue = vi.fn();
      renderComponent({ onChageValue });
      const first = screen.getByDisplayValue("FirstName1");
      await user.clear(first);
      await user.type(first, "Z");
      expect(onChageValue.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("should expose email and phone rows", () => {
      renderComponent();
      expect(screen.getByText("Email address")).toBeVisible();
      expect(screen.getByText("Mobile phone")).toBeVisible();
    });
  });
});
