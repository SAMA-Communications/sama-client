import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { UserAvatar } from "./UserAvatar";

const avatarUrl = "https://example.com/avatar.png";
const avatarBlurHash = "LEHLk~WB2yk8pyo0adR*.7kCMdnj";
const defaultIcon = <div data-testid="default-icon">ICON</div>;

const defaultProps: ComponentProps<typeof UserAvatar> = {
  avatarUrl,
  alt: "Test Avatar",
};

const renderComponent = (props: Partial<ComponentProps<typeof UserAvatar>> = {}) =>
  render(<UserAvatar {...defaultProps} {...props} />);

describe("UserAvatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders img when avatarUrl is provided", () => {
      renderComponent();
      const img = screen.getByRole("img") as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", avatarUrl);
      expect(img).toHaveAttribute("alt", "Test Avatar");
      expect(img).toHaveAttribute("width", "64");
      expect(img).toHaveAttribute("height", "64");
    });

    it("renders Blurhash and loader when avatarBlurHash is provided and avatarUrl is not", () => {
      renderComponent({ avatarUrl: undefined, avatarBlurHash });
      expect(screen.getByTestId("blurhash")).toBeInTheDocument();
      expect(screen.getByTestId("oval-loader")).toBeInTheDocument();
    });

    it("renders default icon when neither avatarUrl nor avatarBlurHash is provided", () => {
      renderComponent({ avatarUrl: undefined, defaultIcon });
      expect(screen.getByTestId("default-icon")).toBeInTheDocument();
    });

    it("applies wrapperClassName correctly", () => {
      renderComponent({ avatarUrl: undefined, wrapperClassName: "custom-class", defaultIcon });
      const wrapper = screen.getByTestId("default-icon").parentElement!;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("applies custom width and height", () => {
      renderComponent({ avatarUrl: undefined, width: 100, height: 80, defaultIcon });
      const wrapper = screen.getByTestId("default-icon").parentElement!;
      expect(wrapper).toHaveStyle({ width: "100px", height: "80px" });
    });
  });
});
