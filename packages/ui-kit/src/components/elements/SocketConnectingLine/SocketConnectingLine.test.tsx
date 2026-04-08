import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { SocketConnectingLine } from "./SocketConnectingLine";

const defaultProps: ComponentProps<typeof SocketConnectingLine> = {
  isSocketConnected: false,
};

const renderComponent = (props: Partial<ComponentProps<typeof SocketConnectingLine>> = {}) =>
  render(<SocketConnectingLine {...defaultProps} {...props} />);

describe("SocketConnectingLine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders connecting line when socket is not connected", () => {
      renderComponent();
      expect(screen.getByText(/connecting/i)).toBeInTheDocument();
    });

    it("does not render when socket is connected", () => {
      renderComponent({ isSocketConnected: true });
      expect(screen.queryByText(/connecting/i)).toBeNull();
    });

    it("renders custom message when provided", () => {
      const message = "Waiting for server...";
      renderComponent({ message });
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it("renders root with layout and accent styles", () => {
      renderComponent();
      const container = screen.getByText(/connecting/i).parentElement;
      expect(container).toHaveClass("ui:absolute", "ui:bg-accent-500", "ui:flex", "ui:w-full");
    });

    it("renders message with typography classes", () => {
      renderComponent();
      const text = screen.getByText(/connecting/i);
      expect(text).toHaveClass("ui:text-center", "ui:font-light", "ui:text-white");
    });
  });
});
