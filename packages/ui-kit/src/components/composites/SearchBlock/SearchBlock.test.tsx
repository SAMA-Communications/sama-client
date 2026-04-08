import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { SearchBlock } from "./SearchBlock";

const defaultProps: ComponentProps<typeof SearchBlock> = {
  isShowDefaultConvs: false,
  isSearchOnlyUsers: true,
  isMaxLimit: false,
  isSelectUserToArray: false,
  selectedUsers: [],
  searchedUsers: [],
  onUserClick: vi.fn(),
};

const renderComponent = (props: Partial<ComponentProps<typeof SearchBlock>> = {}) =>
  render(<SearchBlock {...defaultProps} {...props} />);

describe("SearchBlock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should mount the scrollbar region in user-only search mode", () => {
      renderComponent();
      expect(screen.getByRole("scrollbar")).toBeInTheDocument();
    });

    it("should merge customClassName onto the root", () => {
      const { container } = renderComponent({ customClassName: "search-shell" });
      expect(container.firstElementChild).toHaveClass("search-shell");
    });
  });
});
