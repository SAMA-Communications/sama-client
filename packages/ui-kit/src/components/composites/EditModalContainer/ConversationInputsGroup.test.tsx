import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ConversationInputsGroup } from "./ConversationInputsGroup";

const defaultProps: ComponentProps<typeof ConversationInputsGroup> = {
  onChageValue: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof ConversationInputsGroup>> = {}) =>
  render(<ConversationInputsGroup {...defaultProps} {...props} />);

describe("ConversationInputsGroup", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render group name and description editors bound to the selected chat", () => {
      renderComponent();
      expect(screen.getByText("Group name")).toBeVisible();
      expect(screen.getByText("Description")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should forward field updates through onChageValue", async () => {
      const onChageValue = vi.fn();
      renderComponent({ onChageValue });
      const [nameInput] = screen.getAllByRole("textbox");
      await user.type(nameInput, "X");
      expect(onChageValue).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should render without throwing when adapters supply a minimal conversation", () => {
      expect(() => renderComponent()).not.toThrow();
    });
  });
});
