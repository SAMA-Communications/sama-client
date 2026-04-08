import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { CustomVerticalScrollbar } from "./CustomVerticalScrollbar";

const defaultChildren = <p>Scrollable content</p>;

const renderComponent = (props: Partial<ComponentProps<typeof CustomVerticalScrollbar>> = {}) =>
  render(
    <CustomVerticalScrollbar persistScrollPosition={false} {...props}>
      {props.children ?? defaultChildren}
    </CustomVerticalScrollbar>,
  );

describe("CustomVerticalScrollbar", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render children and expose scrollbar semantics", () => {
      renderComponent();
      expect(screen.getByText("Scrollable content")).toBeVisible();
      expect(screen.getByRole("scrollbar")).toBeInTheDocument();
    });

    it("should apply className and childrenClassName to the layout layers", () => {
      renderComponent({
        className: "outer-scroll",
        childrenClassName: "inner-scroll",
      });
      const root = screen.getByText("Scrollable content").closest(".custom-vertical-scrollbar");
      expect(root).toHaveClass("outer-scroll");
      expect(screen.getByText("Scrollable content").parentElement).toHaveClass("inner-scroll");
    });

    it("should respect autoHeight and autoHeightMax on the outer wrapper", () => {
      renderComponent({
        autoHeight: true,
        autoHeightMax: 120,
        children: <span>Tall stack</span>,
      });
      const root = screen.getByText("Tall stack").closest(".custom-vertical-scrollbar") as HTMLElement;
      expect(root.style.maxHeight).toBe("120px");
    });
  });

  describe("user interaction", () => {
    it("should call onScrollToBottom when the floating control is used", async () => {
      const onScrollToBottom = vi.fn();
      renderComponent({
        isScrollToBottomVisible: true,
        onScrollToBottom,
      });
      await user.click(screen.getByRole("button", { name: "Scroll to bottom" }));
      expect(onScrollToBottom).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should not render the scroll-to-bottom control without a handler", () => {
      renderComponent({ isScrollToBottomVisible: true });
      expect(screen.queryByRole("button", { name: "Scroll to bottom" })).not.toBeInTheDocument();
    });
  });
});
