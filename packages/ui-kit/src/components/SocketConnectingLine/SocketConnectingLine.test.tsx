import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SocketConnectingLine } from "./SocketConnectingLine";

describe("SocketConnectingLine", () => {
  it("renders connecting line when socket is not connected", () => {
    render(<SocketConnectingLine isSocketConnected={false} />);
    expect(screen.getByText(/connecting/i)).toBeInTheDocument();
  });

  it("does not render when socket is connected", () => {
    render(<SocketConnectingLine isSocketConnected={true} />);
    const element = screen.queryByText(/connecting/i);
    expect(element).toBeNull();
  });

  it("renders custom message when provided", () => {
    const message = "Waiting for server...";
    render(
      <SocketConnectingLine isSocketConnected={false} message={message} />
    );
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("renders div with correct classes", () => {
    render(<SocketConnectingLine isSocketConnected={false} />);
    const container = screen.getByText(/connecting/i).parentElement;
    expect(container).toHaveClass(
      "absolute top-0 w-full h-[28px] bg-accent-dark shadow-md z-[1000] flex items-center justify-center"
    );
  });

  it("renders text with correct classes", () => {
    render(<SocketConnectingLine isSocketConnected={false} />);
    const text = screen.getByText(/connecting/i);
    expect(text).toHaveClass("text-center font-light text-[18px] text-white");
  });
});
