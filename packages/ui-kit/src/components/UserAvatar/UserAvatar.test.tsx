import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UserAvatar } from "./UserAvatar";

describe("UserAvatar", () => {
  const avatarUrl = "https://example.com/avatar.png";
  const avatarBlurHash = "LEHLk~WB2yk8pyo0adR*.7kCMdnj";
  const defaultIcon = <div data-testid="default-icon">ICON</div>;

  it("renders img when avatarUrl is provided", () => {
    render(<UserAvatar avatarUrl={avatarUrl} alt="Test Avatar" />);
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", avatarUrl);
    expect(img).toHaveAttribute("alt", "Test Avatar");
    expect(img).toHaveAttribute("width", "64");
    expect(img).toHaveAttribute("height", "64");
  });

  it("renders Blurhash and loader when avatarBlurHash is provided and avatarUrl is not", () => {
    render(<UserAvatar avatarBlurHash={avatarBlurHash} />);
    expect(screen.getByTestId("blurhash")).toBeInTheDocument();
    expect(screen.getByTestId("oval-loader")).toBeInTheDocument();
  });

  it("renders default icon when neither avatarUrl nor avatarBlurHash is provided", () => {
    render(<UserAvatar defaultIcon={defaultIcon} />);
    expect(screen.getByTestId("default-icon")).toBeInTheDocument();
  });

  it("applies wrapperClassName correctly", () => {
    const defaultIcon = <div data-testid="default-icon">ICON</div>;

    render(
      <UserAvatar wrapperClassName="custom-class" defaultIcon={defaultIcon} />
    );
    const wrapper = screen.getByTestId("default-icon").parentElement!;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("applies custom width and height", () => {
    const defaultIcon = <div data-testid="default-icon">ICON</div>;

    render(<UserAvatar width={100} height={80} defaultIcon={defaultIcon} />);
    const wrapper = screen.getByTestId("default-icon").parentElement!;
    expect(wrapper).toHaveStyle({ width: "100px", height: "80px" });
  });
});
