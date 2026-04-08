import type { ComponentProps } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { AvatarWithFallback } from "./AvatarWithFallback";

const defaultProps: ComponentProps<typeof AvatarWithFallback> = {};

const renderComponent = (props: Partial<ComponentProps<typeof AvatarWithFallback>> = {}) =>
  render(<AvatarWithFallback {...defaultProps} {...props} />);

describe("AvatarWithFallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders fallback icon by default", () => {
      renderComponent();
      expect(screen.getByTestId("icon-user")).toBeInTheDocument();
    });

    it("renders provided fallback icon", () => {
      renderComponent({ fallbackIcon: <span data-testid="custom-fallback">ICON</span> });
      const fallback = screen.getByTestId("custom-fallback");
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent("ICON");
    });

    it("renders img when avatarUrl loads successfully", async () => {
      const originalImage = global.Image;
      const MockImage = class {
        onload: () => void = () => {};
        onerror: () => void = () => {};
        set src(_src: string) {
          setTimeout(() => this.onload());
        }
      };
      vi.stubGlobal("Image", MockImage);

      renderComponent({ avatarUrl: "https://example.com/avatar.jpg", altText: "User avatar" });

      await waitFor(() => {
        const img = screen.getByTestId("avatar-with-fallback") as HTMLImageElement;
        expect(img).toBeInTheDocument();
        expect(img.src).toBe("https://example.com/avatar.jpg");
        expect(img.alt).toBe("User avatar");
      });

      vi.stubGlobal("Image", originalImage);
    });

    it("renders fallback if avatarUrl fails to load", async () => {
      const originalImage = global.Image;
      const MockImage = class {
        onload: () => void = () => {};
        onerror: () => void = () => {};
        set src(_src: string) {
          setTimeout(() => this.onerror());
        }
      };
      vi.stubGlobal("Image", MockImage);

      renderComponent({
        avatarUrl: "https://example.com/bad-avatar.jpg",
        fallbackIcon: <span data-testid="custom-fallback">ICON</span>,
      });

      await waitFor(() => {
        const fallback = screen.getByTestId("custom-fallback");
        expect(fallback).toBeInTheDocument();
        expect(fallback).toHaveTextContent("ICON");
      });

      vi.stubGlobal("Image", originalImage);
    });
  });
});
