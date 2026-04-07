import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { MessageLinkPreview } from "./MessageLinkPreview";

const richUrlData: NonNullable<ComponentProps<typeof MessageLinkPreview>["urlData"]> = {
  url: "https://example.com",
  title: "Title",
  description: "Desc",
  images: [],
  favicons: [],
};

const defaultProps: ComponentProps<typeof MessageLinkPreview> = {
  urlData: richUrlData,
  onRefresh: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof MessageLinkPreview>> = {}) =>
  render(<MessageLinkPreview {...defaultProps} {...props} />);

describe("MessageLinkPreview", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render nothing when urlData is missing", () => {
      const { container } = renderComponent({ urlData: null });
      expect(container.firstChild).toBeNull();
    });

    it("should render document layout when isDocument", () => {
      render(
        <MessageLinkPreview
          urlData={{ url: "https://x.com/f.pdf", file_name: "doc.pdf" }}
          isDocument
          formattedFileSize="1 MB"
          onRefresh={vi.fn()}
        />,
      );
      expect(screen.getByText("doc.pdf")).toBeInTheDocument();
      expect(screen.getByText("1 MB")).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should call onRefresh when refresh control is used", async () => {
      const onRefresh = vi.fn();
      renderComponent({ onRefresh });
      await user.click(screen.getByTestId("icon-refresh"));
      expect(onRefresh).toHaveBeenCalledWith(expect.any(Object), "https://example.com");
    });
  });
});
