import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ImageLoader } from "./ImageLoader";

describe("ImageLoader", () => {
  it("renders Blurhash with default hash", () => {
    render(<ImageLoader />);
    const blurhash = screen.getByTestId("blurhash");
    expect(blurhash).toBeInTheDocument();
    expect(blurhash).toHaveAttribute(
      "data-hash",
      "LEHLk~WB2yk8pyo0adR*.7kCMdnj"
    );
  });

  it("renders Blurhash with custom hash", () => {
    render(<ImageLoader blurHash="customHash123" />);
    const blurhash = screen.getByTestId("blurhash");
    expect(blurhash).toHaveAttribute("data-hash", "customHash123");
  });

  it("renders OvalLoader when isShowLoader is true", () => {
    render(<ImageLoader />);
    const oval = screen.getByTestId("oval-loader");
    expect(oval).toBeInTheDocument();
  });

  it("does not render OvalLoader when isShowLoader is false", () => {
    render(<ImageLoader isShowLoader={false} />);
    expect(screen.queryByTestId("oval-loader")).toBeNull();
  });
});
