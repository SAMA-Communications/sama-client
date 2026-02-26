import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { TypingLine } from "./TypingLine";

vi.mock("../../DotsLoader", () => ({
  DotsLoader: ({ height, width }: any) => <div data-testid="dots-loader" data-height={height} data-width={width} />,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TypingLine", () => {
  it("renders dots loader", () => {
    render(<TypingLine typingUserIds={["u1"]} />);
    const loader = screen.getByTestId("dots-loader");
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute("data-height", "22");
    expect(loader).toHaveAttribute("data-width", "16");
  });

  it("renders only 'typing' when isDisplayUserNames = false", () => {
    render(<TypingLine typingUserIds={["u1"]} />);
    const p = screen.getByText(/typing/i);
    expect(p.textContent).toBe("typing");
  });

  it("renders single username when isDisplayUserNames = true", () => {
    render(<TypingLine typingUserIds={["u1"]} isDisplayUserNames />);
    expect(screen.getByText("FirstName1 typing")).toBeInTheDocument();
  });

  it("renders two usernames correctly", () => {
    render(<TypingLine typingUserIds={["u1", "u2"]} isDisplayUserNames />);
    expect(screen.getByText("FirstName1, FirstName2 typing")).toBeInTheDocument();
  });

  it("renders 'and N more' when more than two users", () => {
    render(<TypingLine typingUserIds={["u1", "u2", "u3"]} isDisplayUserNames />);
    expect(screen.getByText("FirstName1 and 2 more typing")).toBeInTheDocument();
  });

  it("applies background class when isDisplayBackground = true", () => {
    const { container } = render(<TypingLine typingUserIds={["u1"]} isDisplayBackground />);
    const wrapper = container.querySelector("div");
    expect(wrapper).toHaveClass("bg-accent-500/10");
  });
});
