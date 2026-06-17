import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { MediaAttachments } from "./MediaAttachments";

const file = {
  file_id: "f1",
  file_name: "a.jpg",
  file_url: "https://example.com/a.jpg",
  file_content_type: "image/jpeg",
  file_width: 800,
  file_height: 600,
} as ComponentProps<typeof MediaAttachments>["attachments"][number];

const defaultProps: ComponentProps<typeof MediaAttachments> = {
  attachments: [file],
  onOpenMedia: vi.fn(),
  disableAnimation: true,
};

const renderComponent = (props: Partial<ComponentProps<typeof MediaAttachments>> = {}) =>
  render(<MediaAttachments {...defaultProps} {...props} />);

describe("MediaAttachments", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render nothing when the attachments list is empty", () => {
      const { container } = renderComponent({ attachments: [] });
      expect(container.firstChild).toBeNull();
    });

    it("should render an image tile for each attachment", () => {
      renderComponent();
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("should merge className onto the grid shell", () => {
      const { container } = renderComponent({ className: "attach-grid-extra" });
      expect(container.firstElementChild).toHaveClass("attach-grid-extra");
    });
  });

  describe("user interaction", () => {
    it("should call onOpenMedia with the attachment index when a tile is activated", async () => {
      const onOpenMedia = vi.fn();
      renderComponent({ onOpenMedia, mid: "m1" });
      await user.click(screen.getByRole("img"));
      expect(onOpenMedia).toHaveBeenCalledWith(0);
    });
  });
});
