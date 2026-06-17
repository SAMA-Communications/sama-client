import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { WrapperRoot } from "./WrapperRoot";

const defaultProps: ComponentProps<typeof WrapperRoot> = {
  children: <span>content</span>,
};

const renderComponent = (props: Partial<ComponentProps<typeof WrapperRoot>> = {}) =>
  render(<WrapperRoot {...defaultProps} {...props} />);

describe("WrapperRoot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render children when not loading", () => {
      renderComponent();
      expect(screen.getByText("content")).toBeVisible();
    });

    it("should replace children with the default OvalLoader when loading", () => {
      renderComponent({ loading: true });
      expect(screen.queryByText("content")).not.toBeInTheDocument();
      expect(screen.getByTestId("mock-oval")).toBeInTheDocument();
    });

    it("should render a custom skeleton when loading and skeleton is provided", () => {
      renderComponent({ loading: true, skeleton: <span data-testid="sk">sk</span> });
      expect(screen.getByTestId("sk")).toBeVisible();
      expect(screen.queryByTestId("mock-oval")).not.toBeInTheDocument();
    });

    it("should honor the as prop for the host element", () => {
      renderComponent({ as: "section", "data-testid": "host" } as ComponentProps<typeof WrapperRoot>);
      expect(screen.getByTestId("host").tagName.toLowerCase()).toBe("section");
    });
  });
});
