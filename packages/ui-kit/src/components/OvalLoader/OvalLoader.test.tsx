import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OvalLoader } from "./OvalLoader";

describe("OvalLoader", () => {
  it("renders wrapper with provided className", () => {
    render(<OvalLoader wrapperClassName="custom-wrapper" />);
    const wrapper = screen.getByTestId("oval-loader");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("custom-wrapper");
  });

  it("renders Oval component with default props", () => {
    render(<OvalLoader />);
    const oval = screen.getByTestId("mock-oval");
    expect(oval).toBeInTheDocument();
    expect(oval).toHaveAttribute("data-height", "32");
    expect(oval).toHaveAttribute("data-width", "32");
    expect(oval).toHaveAttribute("data-color", "#ffffff");
    expect(oval).toHaveAttribute("data-secondary-color", "#a0a0a0");
  });

  it("renders Oval component with custom props", () => {
    render(<OvalLoader height={50} width={60} color="red" />);
    const oval = screen.getByTestId("mock-oval");
    expect(oval).toHaveAttribute("data-height", "50");
    expect(oval).toHaveAttribute("data-width", "60");
    expect(oval).toHaveAttribute("data-color", "red");
  });
});
