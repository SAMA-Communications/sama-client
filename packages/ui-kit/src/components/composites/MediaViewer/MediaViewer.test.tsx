import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { MediaAttachmentData } from "@elements/MediaAttachment";
import { MediaViewer } from "./MediaViewer";

const imageA: MediaAttachmentData = {
  file_name: "a.png",
  file_content_type: "image/png",
  file_url: "https://example.com/a.png",
};

const imageB: MediaAttachmentData = {
  file_name: "b.png",
  file_content_type: "image/png",
  file_url: "https://example.com/b.png",
};

const defaultProps: ComponentProps<typeof MediaViewer> = {
  attachments: [imageA],
  currentIndex: 0,
  onIndexChange: vi.fn(),
  onClose: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof MediaViewer>> = {}) =>
  render(<MediaViewer {...defaultProps} {...props} />);

describe("MediaViewer", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should show the position counter", () => {
      renderComponent({
        attachments: [imageA, imageB],
        currentIndex: 1,
      });
      expect(screen.getByText("2 / 2")).toBeVisible();
    });

    it("should merge className onto the root", () => {
      const { container } = renderComponent({ className: "viewer-shell" });
      expect(container.firstElementChild).toHaveClass("viewer-shell");
    });
  });

  describe("user interaction", () => {
    it("should call onClose when the desktop overlay is clicked", async () => {
      const onClose = vi.fn();
      const { container } = renderComponent({ onClose, isMobile: false });
      await user.click(container.firstElementChild as HTMLElement);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose from the mobile close button", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose, isMobile: true });
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onIndexChange when navigating", async () => {
      const onIndexChange = vi.fn();
      renderComponent({
        attachments: [imageA, imageB],
        currentIndex: 0,
        onIndexChange,
      });
      const chevron = screen.getByTestId("icon-chevron-right").parentElement;
      expect(chevron).toBeTruthy();
      await user.click(chevron!);
      expect(onIndexChange).toHaveBeenCalledWith(1);
    });
  });

  describe("edge cases", () => {
    it("should render a single attachment without throwing", () => {
      expect(() => renderComponent()).not.toThrow();
      expect(screen.getByText("1 / 1")).toBeVisible();
    });
  });
});
