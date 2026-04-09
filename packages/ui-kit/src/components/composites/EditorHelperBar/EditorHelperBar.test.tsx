import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { EditorHelperBar } from "./EditorHelperBar";

const defaultProps: ComponentProps<typeof EditorHelperBar> = {
  docsHref: "https://example.com/docs",
  tooltipId: "helper-tip",
  actions: [{ label: "Insert sample", onClick: vi.fn() }],
};

const renderComponent = (props: Partial<ComponentProps<typeof EditorHelperBar>> = {}) =>
  render(<EditorHelperBar {...defaultProps} {...props} />);

describe("EditorHelperBar", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should expose the docs link with the configured href", () => {
      renderComponent();
      expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com/docs");
      expect(screen.getByTestId("icon-info")).toBeInTheDocument();
    });

    it("should render tooltip actions inside the mocked tooltip region", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Insert sample" })).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should run the action callback when a helper row is pressed", async () => {
      const action = vi.fn();
      renderComponent({
        actions: [
          { label: "One", onClick: action },
          { label: "Two", onClick: vi.fn() },
        ],
      });
      await user.click(screen.getByRole("button", { name: "One" }));
      expect(action).toHaveBeenCalledTimes(1);
    });
  });
});
