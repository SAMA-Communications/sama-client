import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ImageView } from "./ImageView";
import { imageMock } from "../../__mocks__/image.mock";

vi.mock("../MediaBlurHash", () => ({
  MediaBlurHash: ({ status, blurHash }: any) => (
    <div data-testid="media-blurhash">
      {status}-{blurHash ?? ""}
    </div>
  ),
}));

describe("ImageView", () => {
  it("renders img element with correct src and alt", () => {
    render(<ImageView image={imageMock} />);
    const img = screen.getByAltText("Test Image") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(imageMock.file_url);
  });

  it("renders MediaBlurHash initially", () => {
    render(<ImageView image={imageMock} />);
    const preloader = screen.getByTestId("media-blurhash");
    expect(preloader).toBeInTheDocument();
    expect(preloader).toHaveTextContent(`loading-${imageMock.file_blur_hash}`);
  });

  it("calls onClick when image is clicked", () => {
    const onClick = vi.fn();
    render(<ImageView image={imageMock} onClick={onClick} />);
    const img = screen.getByAltText("Test Image");
    fireEvent.click(img);
    expect(onClick).toHaveBeenCalled();
  });

  it("does not call onClick if loadStatus is error", () => {
    const onClick = vi.fn();
    render(<ImageView image={imageMock} onClick={onClick} />);
    const img = screen.getByAltText("Test Image");

    fireEvent.error(img);
    fireEvent.click(img);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("updates loadStatus to success on load", () => {
    render(<ImageView image={imageMock} />);
    const img = screen.getByAltText("Test Image");
    fireEvent.load(img);
    expect(screen.queryByTestId("media-blurhash")).toBeNull();
  });

  it("updates loadStatus to error on error", () => {
    render(<ImageView image={imageMock} />);
    const img = screen.getByAltText("Test Image");
    fireEvent.error(img);
    const preloader = screen.getByTestId("media-blurhash");
    expect(preloader).toBeInTheDocument();
    expect(preloader).toHaveTextContent(`error-${imageMock.file_blur_hash}`);
  });
});
