import type { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { InfoBox } from "./InfoBox";

const defaultProps: ComponentProps<typeof InfoBox> = {
  title: "Field label",
  value: "Stored value",
};

const renderComponent = (props: Partial<ComponentProps<typeof InfoBox>> = {}) =>
  render(<InfoBox {...defaultProps} {...props} />);

describe("InfoBox", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("rendering", () => {
    it("should render title and value as read-only text", () => {
      renderComponent();
      expect(screen.getByText("Field label")).toBeVisible();
      expect(screen.getByText("Stored value")).toBeVisible();
    });

    it("should render placeholder when value is empty", () => {
      renderComponent({ value: "", placeholder: "Enter email" });
      expect(screen.getByText("Enter email")).toBeVisible();
    });

    it("should map iconType to the correct lucide mock", () => {
      const { rerender } = render(<InfoBox title="Phone" value="1" iconType="phone" />);
      expect(screen.getByTestId("icon-phone")).toBeInTheDocument();

      rerender(<InfoBox title="Email" value="a@b.com" iconType="email" />);
      expect(screen.getByTestId("icon-mail")).toBeInTheDocument();

      rerender(<InfoBox title="Login" value="u" iconType="login" />);
      expect(screen.getByTestId("icon-user")).toBeInTheDocument();
    });

    it("should hide the leading icon when isIconEnable is false", () => {
      renderComponent({ isIconEnable: false });
      expect(screen.queryByTestId("icon-user")).not.toBeInTheDocument();
    });

    it("should merge className onto the root", () => {
      const { container } = renderComponent({ className: "extra-info-box" });
      expect(container.firstElementChild).toHaveClass("extra-info-box");
    });
  });

  describe("props and conditional rendering", () => {
    it("should return null when hideIfNull is true and value is empty", () => {
      const { container } = renderComponent({ value: "", hideIfNull: true });
      expect(container).toBeEmptyDOMElement();
    });

    it("should show pencil affordance when isEnableToEdit is true and not in controlled input mode", () => {
      renderComponent({ isEnableToEdit: true, onClick: vi.fn() });
      expect(screen.getByTestId("icon-pencil")).toBeInTheDocument();
    });

    it("should not show pencil when onChangeValue provides the editable input variant", () => {
      renderComponent({
        systemTitle: "name",
        onChangeValue: vi.fn(),
        isEnableToEdit: true,
      });
      expect(screen.queryByTestId("icon-pencil")).not.toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should call onClick when the root is clicked", async () => {
      const onClick = vi.fn();
      renderComponent({ onClick });
      await user.click(screen.getByText("Field label"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should call onChangeValue with systemTitle and text when input changes", async () => {
      const onChangeValue = vi.fn();
      renderComponent({
        title: "Group name",
        value: "Alpha",
        systemTitle: "name",
        onChangeValue,
      });
      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "Beta");
      expect(onChangeValue).toHaveBeenCalled();
      expect(onChangeValue.mock.calls.some(([, v]) => typeof v === "string" && v.includes("Beta"))).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should render without optional handlers", () => {
      expect(() => renderComponent({ onClick: undefined, onChangeValue: undefined })).not.toThrow();
      expect(screen.getByText("Stored value")).toBeVisible();
    });
  });
});
