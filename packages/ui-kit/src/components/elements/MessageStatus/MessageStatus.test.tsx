import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { MessageStatus } from "./MessageStatus";

const defaultProps: ComponentProps<typeof MessageStatus> = {
  status: "sent",
};

const renderComponent = (props: Partial<ComponentProps<typeof MessageStatus>> = {}) =>
  render(<MessageStatus {...defaultProps} {...props} />);

describe("MessageStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render nothing when neither status nor message is provided", () => {
      const { container } = render(<MessageStatus />);
      expect(container.firstChild).toBeNull();
    });

    it("should render sent icon for sent status", () => {
      renderComponent({ status: "sent" });
      expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    });

    it("should render read icon for read status", () => {
      renderComponent({ status: "read" });
      expect(screen.getByTestId("icon-check-check")).toBeInTheDocument();
    });

    it("should derive the icon from message.status when status prop is omitted", () => {
      render(
        <MessageStatus message={{ status: "read" } as ComponentProps<typeof MessageStatus>["message"]} />,
      );
      expect(screen.getByTestId("icon-check-check")).toBeInTheDocument();
    });

    it("should use the clock fallback for unknown status values", () => {
      render(
        <MessageStatus
          message={
            { status: "pending" } as ComponentProps<typeof MessageStatus>["message"]
          }
        />,
      );
      expect(screen.getByTestId("icon-clock")).toBeInTheDocument();
    });

    it("should pass white color tokens to the icon when color is white", () => {
      renderComponent({ status: "sent", color: "white" });
      expect(screen.getByTestId("icon-check")).toHaveAttribute("data-color", "white");
    });
  });

  describe("props", () => {
    it("should merge className onto the root", () => {
      renderComponent({ className: "msg-status-extra" });
      expect(screen.getByTestId("icon-check").parentElement).toHaveClass("msg-status-extra");
    });
  });
});
