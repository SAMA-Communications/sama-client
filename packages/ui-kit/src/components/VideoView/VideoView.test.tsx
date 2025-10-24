import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VideoView } from "./VideoView";
import { videoMock } from "../../__mocks__/video.mock";

describe("VideoView", () => {
  it("renders video element with correct attributes", () => {
    render(<VideoView video={videoMock} />);
    const videoEl = screen.getByTestId("video") as HTMLVideoElement;
    expect(videoEl).toBeInTheDocument();
    expect(videoEl).toHaveAttribute("src", `${videoMock.file_url}#t=0.1`);
    expect(videoEl).toHaveAttribute("poster", videoMock.file_name);
  });

  it("renders MediaBlurHash initially", () => {
    render(<VideoView video={videoMock} />);
    expect(screen.getByTestId("media-blurhash")).toBeInTheDocument();
  });

  it("renders PlayButton after load success if removePlayButton=false and enableControls=false", () => {
    render(<VideoView video={videoMock} />);
    const videoEl = screen.getByTestId("video") as HTMLVideoElement;

    fireEvent.loadedData(videoEl);

    expect(screen.getByTestId("play-button")).toBeInTheDocument();
  });

  it("does not render PlayButton if removePlayButton=true", () => {
    render(<VideoView video={videoMock} removePlayButton />);
    const videoEl = screen.getByTestId("video") as HTMLVideoElement;

    fireEvent.loadedData(videoEl);
    expect(screen.queryByTestId("play-button")).toBeNull();
  });

  it("does not render PlayButton if enableControls=true", () => {
    render(<VideoView video={videoMock} enableControls />);
    const videoEl = screen.getByTestId("video") as HTMLVideoElement;

    fireEvent.loadedData(videoEl);
    expect(screen.queryByTestId("play-button")).toBeNull();
  });

  it("renders MediaBlurHash on error", () => {
    render(<VideoView video={videoMock} />);
    const videoEl = screen.getByTestId("video") as HTMLVideoElement;

    fireEvent.error(videoEl);
    expect(screen.getByTestId("media-blurhash")).toBeInTheDocument();
  });

  it("calls onClick when video is clicked", () => {
    const onClick = vi.fn();
    render(<VideoView video={videoMock} onClick={onClick} />);
    const videoEl = screen.getByTestId("video") as HTMLVideoElement;
    fireEvent.click(videoEl);
    expect(onClick).toHaveBeenCalled();
  });
});
