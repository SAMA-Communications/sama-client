import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DynamicAvatar } from "./DynamicAvatar";

vi.mock("../ImageLoader", () => ({
  ImageLoader: ({ blurHash, ...props }: any) => (
    <div data-testid="image-loader">{blurHash ?? ""}</div>
  ),
}));

vi.mock("./AvatarWithFallback", () => ({
  AvatarWithFallback: ({ avatarUrl, altText }: any) => (
    <div
      data-testid="avatar-with-fallback"
      data-url={avatarUrl}
      data-alt={altText}
    >
      avatar
    </div>
  ),
}));

describe("DynamicAvatar", () => {
  it("renders AvatarWithFallback when avatarUrl is provided", () => {
    render(
      <DynamicAvatar
        avatarUrl="https://example.com/avatar.jpg"
        altText="User avatar"
      />
    );
    const avatar = screen.getByTestId("avatar-with-fallback");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute(
      "data-url",
      "https://example.com/avatar.jpg"
    );
    expect(avatar).toHaveAttribute("data-alt", "User avatar");
  });

  it("renders ImageLoader when avatarUrl is not provided but avatarBlurHash is", () => {
    render(<DynamicAvatar avatarBlurHash="blurhash123" />);
    const loader = screen.getByTestId("image-loader");
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveTextContent("blurhash123");
  });

  it("renders defaultIcon when neither avatarUrl nor avatarBlurHash are provided", () => {
    render(
      <DynamicAvatar
        defaultIcon={<span data-testid="default-icon">ICON</span>}
      />
    );
    const icon = screen.getByTestId("default-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent("ICON");
  });

  it("passes imageLoaderProps to ImageLoader", () => {
    render(
      <DynamicAvatar
        avatarBlurHash="blurhash123"
        imageLoaderProps={{ isShowLoader: false }}
      />
    );
    const loader = screen.getByTestId("image-loader");
    expect(loader).toBeInTheDocument();
  });
});
