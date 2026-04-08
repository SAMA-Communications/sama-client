import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { Modal } from "./Modal";

const defaultProps: ComponentProps<typeof Modal> = {
  children: <p>Modal body</p>,
};

const renderComponent = (props: Partial<ComponentProps<typeof Modal>> = {}) =>
  render(<Modal {...defaultProps} {...props} />);

describe("Modal", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render children inside an aria-modal dialog", () => {
      renderComponent();
      expect(screen.getByRole("dialog")).toBeVisible();
      expect(screen.getByText("Modal body")).toBeVisible();
    });

    it("should merge overlay className", () => {
      const { container } = renderComponent({ className: "overlay-extra" });
      expect(container.firstElementChild).toHaveClass("overlay-extra");
    });
  });

  describe("user interaction", () => {
    it("should call onClick when the backdrop is clicked", async () => {
      const onClick = vi.fn();
      const { container } = renderComponent({ onClick });
      const overlay = container.firstElementChild as HTMLElement;
      await user.click(overlay);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
