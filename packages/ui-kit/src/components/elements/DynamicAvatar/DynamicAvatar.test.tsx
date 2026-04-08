import type { ComponentProps } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DynamicAvatar } from "./DynamicAvatar";

const defaultProps: ComponentProps<typeof DynamicAvatar> = {
  bgColorKey: "k",
  size: 48,
};

const renderComponent = (props: Partial<ComponentProps<typeof DynamicAvatar>> = {}) =>
  render(<DynamicAvatar {...defaultProps} {...props} />);

describe("DynamicAvatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render a custom fallback icon when no media is available", () => {
      renderComponent({
        defaultIcon: <span data-testid="fallback-avatar">FB</span>,
      });
      expect(screen.getByTestId("fallback-avatar")).toBeVisible();
    });

    it("should render ImageLoader output when a blur hash is provided", () => {
      renderComponent({
        avatarBlurHash: "LEHLk~WB2yk8pyo0adR*.7kCMdnj",
        imageLoaderProps: { isShowLoader: false },
      });
      expect(screen.getByTestId("image-loader")).toBeInTheDocument();
    });

    it("should render AvatarWithFallback when avatarUrl is set", async () => {
      const originalImage = global.Image;
      const MockImage = class {
        onload: () => void = () => {};
        set src(_: string) {
          queueMicrotask(() => this.onload());
        }
      } as unknown as typeof Image;
      global.Image = MockImage;

      renderComponent({
        avatarUrl: "https://example.com/face.png",
        altText: "User",
      });

      await waitFor(() => {
        expect(screen.getByTestId("avatar-with-fallback")).toHaveAttribute(
          "src",
          "https://example.com/face.png",
        );
      });

      global.Image = originalImage;
    });
  });

  describe("edge cases", () => {
    it("should render without optional motion or ref props", () => {
      expect(() => renderComponent({ defaultIcon: <i /> })).not.toThrow();
    });
  });
});
