import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { MessageAttachment } from "types/samaWssModels";

import { LastMessageMedia } from "./LastMessageMedia";

const baseAttachment: MessageAttachment = {
  file_id: "f1",
  file_name: "a.png",
  file_content_type: "image/png",
};

const defaultProps: ComponentProps<typeof LastMessageMedia> = {
  isSelected: false,
  attachment: baseAttachment,
};

const renderComponent = (props: Partial<ComponentProps<typeof LastMessageMedia>> = {}) =>
  render(<LastMessageMedia {...defaultProps} {...props} />);

describe("LastMessageMedia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render blurhash output when file_blur_hash exists", () => {
      renderComponent({
        attachment: { ...baseAttachment, file_blur_hash: "hash123" },
      });
      expect(screen.getByTestId("blurhash")).toHaveAttribute("data-hash", "hash123");
    });

    it("should render the video glyph for video attachments", () => {
      renderComponent({
        attachment: { ...baseAttachment, file_content_type: "video/mp4" },
      });
      expect(screen.getByTestId("icon-video")).toBeInTheDocument();
    });

    it("should render the image glyph for image attachments without a hash", () => {
      renderComponent({
        attachment: baseAttachment,
        fileType: "Image",
      });
      expect(screen.getByTestId("icon-image")).toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("should adjust icon styling when the parent row is selected", () => {
      const { rerender } = renderComponent({ isSelected: false });
      expect(screen.getByTestId("icon-image")).toBeInTheDocument();

      rerender(<LastMessageMedia {...defaultProps} isSelected attachment={baseAttachment} fileType="Image" />);
      expect(screen.getByTestId("icon-image")).toHaveAttribute("data-color", "white");
    });
  });
});
