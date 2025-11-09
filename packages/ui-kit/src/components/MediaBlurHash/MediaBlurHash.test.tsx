import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MediaBlurHash, DEFAULT_BLUR_HASH } from "./MediaBlurHash";

describe("MediaBlurHash", () => {
  it("renders Blurhash with default hash if no blurHash provided", () => {
    render(<MediaBlurHash />);
    const blurhash = screen.getByTestId("blurhash");
    expect(blurhash).toHaveAttribute("data-hash", DEFAULT_BLUR_HASH);
  });

  it("renders Blurhash with provided blurHash", () => {
    render(<MediaBlurHash blurHash="customHash123" />);
    const blurhash = screen.getByTestId("blurhash");
    expect(blurhash).toHaveAttribute("data-hash", "customHash123");
  });

  it("renders Oval loader when status is loading", () => {
    render(<MediaBlurHash status="loading" />);
    const oval = screen.getByTestId("mock-oval");
    expect(oval).toBeInTheDocument();
  });

  it("renders AlertCircle when status is error", () => {
    render(<MediaBlurHash status="error" />);
    const alert = screen.getByTestId("alert-circle");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("data-color", "#f87171");
  });

  it("passes custom loader props to Oval", () => {
    render(
      <MediaBlurHash
        status="loading"
        loaderSize={60}
        loaderColor="red"
        loaderSecondaryColor="blue"
      />
    );
    const oval = screen.getByTestId("mock-oval");
    expect(oval).toHaveAttribute("data-height", "60");
    expect(oval).toHaveAttribute("data-width", "60");
    expect(oval).toHaveAttribute("data-color", "red");
    expect(oval).toHaveAttribute("data-secondary-color", "blue");
  });
});
