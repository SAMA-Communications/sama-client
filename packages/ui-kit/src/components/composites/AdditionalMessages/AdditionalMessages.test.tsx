import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { AdditionalMessages } from "./AdditionalMessages";

const replyBase: ComponentProps<typeof AdditionalMessages> = {
  type: "reply",
  message: { body: "Original text", from: "u1" },
  senderName: "Alex",
};

const renderComponent = (props: Partial<ComponentProps<typeof AdditionalMessages>> = {}) =>
  render(<AdditionalMessages {...replyBase} {...props} />);

describe("AdditionalMessages", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show the reply title and quoted body", () => {
      renderComponent();
      expect(screen.getByText("Alex")).toBeVisible();
      expect(screen.getByText("Original text")).toBeVisible();
    });

    it("should render nothing when the message carries an error flag", () => {
      const { container } = renderComponent({
        message: { error: "failed" },
      });
      expect(container.firstChild).toBeNull();
    });
  });

  describe("user interaction", () => {
    it("should call onCloseFunc when the dismiss control is used", async () => {
      const onCloseFunc = vi.fn();
      renderComponent({
        message: { body: "Hi" },
        senderName: "Sam",
        onCloseFunc,
      });
      await user.click(screen.getByTestId("icon-x"));
      expect(onCloseFunc).toHaveBeenCalledTimes(1);
    });
  });
});
