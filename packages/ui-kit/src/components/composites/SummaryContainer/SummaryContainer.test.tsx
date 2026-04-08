import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { SummaryContainer } from "./SummaryContainer";

const defaultProps: ComponentProps<typeof SummaryContainer> = {
  summaryContent: { isLoading: false, text: "Summary body", filter: "day" },
  onClose: vi.fn(),
  getFilterLabel: (f) => `Filter: ${f}`,
};

const renderComponent = (props: Partial<ComponentProps<typeof SummaryContainer>> = {}) =>
  render(<SummaryContainer {...defaultProps} {...props} />);

describe("SummaryContainer", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render nothing when summaryContent is null", () => {
      const { container } = renderComponent({ summaryContent: null });
      expect(container.firstChild).toBeNull();
    });

    it("should show summary text and filter label", () => {
      renderComponent();
      expect(screen.getByText("Summary body")).toBeVisible();
      expect(screen.getByText("Filter: day")).toBeVisible();
    });
  });

  describe("user interaction", () => {
    it("should call onClose when the dismiss icon is activated", async () => {
      const onClose = vi.fn();
      renderComponent({ onClose });
      await user.click(screen.getByTestId("icon-x"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
