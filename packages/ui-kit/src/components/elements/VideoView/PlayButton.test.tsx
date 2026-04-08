import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { PlayButton } from "./PlayButton";

const defaultProps: ComponentProps<typeof PlayButton> = {};

const renderComponent = (props: Partial<ComponentProps<typeof PlayButton>> = {}) =>
  render(<PlayButton {...defaultProps} {...props} />);

describe("PlayButton", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render the play glyph target", () => {
      renderComponent();
      expect(screen.getByTestId("play-button")).toBeVisible();
      expect(screen.getByText("▶")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should invoke onClick when present", async () => {
      const onClick = vi.fn();
      renderComponent({ onClick });
      await user.click(screen.getByTestId("play-button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should not throw when onClick is omitted", async () => {
      renderComponent();
      await expect(user.click(screen.getByTestId("play-button"))).resolves.not.toThrow();
    });
  });
});
