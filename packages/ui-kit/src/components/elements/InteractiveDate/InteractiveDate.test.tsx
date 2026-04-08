import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { InteractiveDate } from "./InteractiveDate";

const defaultProps: ComponentProps<typeof InteractiveDate> = {
  date: 1704067200,
  locale: "en-US",
};

const renderComponent = (props: Partial<ComponentProps<typeof InteractiveDate>> = {}) =>
  render(<InteractiveDate {...defaultProps} {...props} />);

describe("InteractiveDate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should format unix seconds", () => {
      renderComponent();
      expect(screen.getByText(/Jan/)).toBeVisible();
    });

    it("should format Date instance", () => {
      renderComponent({ date: new Date("2024-06-15T12:00:00Z") });
      expect(screen.getByText(/Jun/)).toBeVisible();
    });
  });
});
