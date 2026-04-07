import type { ComponentProps } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { imageMock } from "../../../__mocks__/image.mock";
import { ImageView } from "./ImageView";

vi.mock("../MediaBlurHash", () => ({
  MediaBlurHash: ({ status, blurHash }: { status: string; blurHash?: string }) => (
    <div data-testid="media-blurhash">
      {status}-{blurHash ?? ""}
    </div>
  ),
}));

const defaultProps: ComponentProps<typeof ImageView> = {
  image: imageMock,
};

const renderComponent = (props: Partial<ComponentProps<typeof ImageView>> = {}) =>
  render(<ImageView {...defaultProps} {...props} />);

describe("ImageView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders img element with correct src and alt", () => {
      renderComponent();
      const img = screen.getByAltText("Test Image") as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toBe(imageMock.file_url);
    });

    it("renders MediaBlurHash initially", () => {
      renderComponent();
      const preloader = screen.getByTestId("media-blurhash");
      expect(preloader).toBeInTheDocument();
      expect(preloader).toHaveTextContent(`loading-${imageMock.file_blur_hash}`);
    });

    it("updates loadStatus to success on load", () => {
      renderComponent();
      const img = screen.getByAltText("Test Image");
      fireEvent.load(img);
      expect(screen.queryByTestId("media-blurhash")).toBeNull();
    });

    it("updates loadStatus to error on error", () => {
      renderComponent();
      const img = screen.getByAltText("Test Image");
      fireEvent.error(img);
      const preloader = screen.getByTestId("media-blurhash");
      expect(preloader).toBeInTheDocument();
      expect(preloader).toHaveTextContent(`error-${imageMock.file_blur_hash}`);
    });
  });

  describe("user interaction", () => {
    it("calls onClick when image is clicked", () => {
      const onClick = vi.fn();
      renderComponent({ onClick });
      const img = screen.getByAltText("Test Image");
      fireEvent.click(img);
      expect(onClick).toHaveBeenCalled();
    });

    it("does not call onClick if loadStatus is error", () => {
      const onClick = vi.fn();
      renderComponent({ onClick });
      const img = screen.getByAltText("Test Image");
      fireEvent.error(img);
      fireEvent.click(img);
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
