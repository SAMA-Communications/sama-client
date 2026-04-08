import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { SearchInput } from "./SearchInput";

const defaultProps: ComponentProps<typeof SearchInput> = {};

const renderComponent = (props: Partial<ComponentProps<typeof SearchInput>> = {}) =>
  render(<SearchInput {...defaultProps} {...props} />);

describe("SearchInput", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render search field with placeholder", () => {
      renderComponent({ placeholder: "Find chats" });
      expect(screen.getByRole("searchbox", { name: "Find chats" })).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should show clear control when there is text", async () => {
      renderComponent();
      const input = screen.getByRole("searchbox");
      await user.type(input, "hello");
      expect(screen.getByRole("button", { name: "Clear search" })).toBeVisible();
    });

    it("should call onChange when controlled", async () => {
      const onChange = vi.fn();
      renderComponent({ value: "", onChange });
      await user.type(screen.getByRole("searchbox"), "a");
      expect(onChange).toHaveBeenCalled();
    });
  });
});
