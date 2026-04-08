import type { ComponentProps, RefObject } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { MagicButton } from "./MagicButton";

const inputTextRef = { current: { value: "" } } as RefObject<HTMLTextAreaElement>;

const defaultProps: ComponentProps<typeof MagicButton> = {
  inputTextRef,
  isBlockedConv: false,
};

const renderComponent = (props: Partial<ComponentProps<typeof MagicButton>> = {}) =>
  render(<MagicButton {...defaultProps} {...props} />);

describe("MagicButton", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render the sparkles trigger", () => {
      renderComponent();
      expect(screen.getByTestId("icon-sparkles")).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should reveal summary options after the trigger is pressed", async () => {
      renderComponent();
      await user.click(screen.getByTestId("icon-sparkles"));
      expect(screen.getByText("Get summary:")).toBeVisible();
      expect(screen.getByText("- last day")).toBeVisible();
    });
  });
});
