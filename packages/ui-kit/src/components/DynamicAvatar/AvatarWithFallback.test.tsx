import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AvatarWithFallback } from "./AvatarWithFallback";

describe("AvatarWithFallback", () => {
  it("renders fallback icon by default", () => {
    render(<AvatarWithFallback />);
    const fallback = screen.getByTestId("icon-user");
    expect(fallback).toBeInTheDocument();
  });

  it("renders provided fallback icon", () => {
    render(
      <AvatarWithFallback
        fallbackIcon={<span data-testid="custom-fallback">ICON</span>}
      />
    );
    const fallback = screen.getByTestId("custom-fallback");
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent("ICON");
  });

  it("renders img when avatarUrl loads successfully", async () => {
    // @ts-ignore
    const originalImage = global.Image;
    const mockImage: any = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_src: string) {
        setTimeout(() => this.onload());
      }
    };
    // @ts-ignore
    global.Image = mockImage;

    render(
      <AvatarWithFallback
        avatarUrl="https://example.com/avatar.jpg"
        altText="User avatar"
      />
    );

    await waitFor(() => {
      const img = screen.getByTestId(
        "avatar-with-fallback"
      ) as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toBe("https://example.com/avatar.jpg");
      expect(img.alt).toBe("User avatar");
    });

    // @ts-ignore
    global.Image = originalImage;
  });

  it("renders fallback if avatarUrl fails to load", async () => {
    // @ts-ignore
    const originalImage = global.Image;
    const mockImage: any = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_src: string) {
        setTimeout(() => this.onerror());
      }
    };
    // @ts-ignore
    global.Image = mockImage;

    render(
      <AvatarWithFallback
        avatarUrl="https://example.com/bad-avatar.jpg"
        fallbackIcon={<span data-testid="custom-fallback">ICON</span>}
      />
    );

    await waitFor(() => {
      const fallback = screen.getByTestId("custom-fallback");
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent("ICON");
    });

    // @ts-ignore
    global.Image = originalImage;
  });
});
