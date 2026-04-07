import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { MediaAttachment } from "./MediaAttachment";

const imageAttachment: ComponentProps<typeof MediaAttachment>["attachment"] = {
  file_id: "f1",
  file_name: "pic.jpg",
  file_url: "https://example.com/p.jpg",
  file_content_type: "image/jpeg",
};

const defaultProps: ComponentProps<typeof MediaAttachment> = {
  index: 0,
  flexGrow: 1,
  attachment: imageAttachment,
  onClick: vi.fn(),
  removeFileFunc: vi.fn(),
  disableAnimation: true,
};

const renderComponent = (props: Partial<ComponentProps<typeof MediaAttachment>> = {}) =>
  render(<MediaAttachment {...defaultProps} {...props} />);

describe("MediaAttachment", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render image attachment", () => {
      renderComponent();
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should call removeFileFunc when remove is activated", async () => {
      const removeFileFunc = vi.fn();
      renderComponent({ removeFileFunc });
      await user.click(screen.getByRole("button", { name: "Remove" }));
      expect(removeFileFunc).toHaveBeenCalledWith(0);
    });
  });
});
