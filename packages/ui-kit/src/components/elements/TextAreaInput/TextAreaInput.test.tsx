import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { TextAreaInput } from "./TextAreaInput";

const defaultProps: ComponentProps<typeof TextAreaInput> = {
  autoFocus: false,
};

const renderComponent = (props: Partial<ComponentProps<typeof TextAreaInput>> = {}) =>
  render(<TextAreaInput {...defaultProps} {...props} />);

describe("TextAreaInput", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render with placeholder", () => {
      renderComponent({ placeholder: "Type here" });
      expect(screen.getByPlaceholderText("Type here")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onInput when value changes", async () => {
      const onInput = vi.fn();
      renderComponent({ onInput });
      await user.type(screen.getByRole("textbox"), "hi");
      expect(onInput).toHaveBeenCalled();
    });
  });
});
