import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { InformativeMessage } from "./InformativeMessage";

const defaultProps: ComponentProps<typeof InformativeMessage> = {
  text: "No messages yet",
};

const renderComponent = (props: Partial<ComponentProps<typeof InformativeMessage>> = {}) =>
  render(<InformativeMessage {...defaultProps} {...props} />);

describe("InformativeMessage", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render text", () => {
      renderComponent();
      expect(screen.getByText("No messages yet")).toBeVisible();
    });

    it("should expose button role when onClick is set", () => {
      renderComponent({ text: "Tap me", onClick: vi.fn() });
      expect(screen.getByRole("button", { name: "Tap me" })).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onClick when activated", async () => {
      const onClick = vi.fn();
      renderComponent({ text: "Action", onClick });
      await user.click(screen.getByRole("button", { name: "Action" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
