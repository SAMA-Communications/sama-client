import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { EditorLogsPanel } from "./EditorLogsPanel";

const defaultProps: ComponentProps<typeof EditorLogsPanel> = {
  visible: true,
  onClose: vi.fn(),
  children: <pre>trace line</pre>,
};

const renderComponent = (props: Partial<ComponentProps<typeof EditorLogsPanel>> = {}) =>
  render(<EditorLogsPanel {...defaultProps} {...props} />);

describe("EditorLogsPanel", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render the debugging chrome and slotted children", () => {
      renderComponent();
      expect(screen.getByText("Debugging log:")).toBeVisible();
      expect(screen.getByText("trace line")).toBeVisible();
    });

    it("should return null when visible is false", () => {
      const { container } = renderComponent({ visible: false });
      expect(container.firstChild).toBeNull();
    });

    it("should merge className onto the animated root", () => {
      renderComponent({ className: "log-shell" });
      expect(document.querySelector(".log-shell")).toBeTruthy();
    });
  });

  describe("user interaction", () => {
    it("should call onClose when the minimize control is used", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose });
      await user.click(screen.getByRole("button"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
