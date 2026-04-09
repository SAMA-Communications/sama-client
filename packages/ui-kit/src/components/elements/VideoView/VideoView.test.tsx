import type { ComponentProps } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { videoMock } from "../../../__mocks__/video.mock";
import { VideoView } from "./VideoView";

const defaultProps: ComponentProps<typeof VideoView> = {
  video: videoMock,
};

const renderComponent = (props: Partial<ComponentProps<typeof VideoView>> = {}) =>
  render(<VideoView {...defaultProps} {...props} />);

describe("VideoView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders video element with correct attributes", () => {
      renderComponent();
      const videoEl = screen.getByTestId("video") as HTMLVideoElement;
      expect(videoEl).toBeInTheDocument();
      expect(videoEl).toHaveAttribute("src", `${videoMock.file_url}#t=0.1`);
      expect(videoEl).toHaveAttribute("poster", videoMock.file_name);
    });

    it("renders MediaBlurHash initially", () => {
      renderComponent();
      expect(screen.getByTestId("media-blurhash")).toBeInTheDocument();
    });

    it("renders PlayButton after load success if removePlayButton=false and enableControls=false", () => {
      renderComponent();
      const videoEl = screen.getByTestId("video") as HTMLVideoElement;
      fireEvent.loadedData(videoEl);
      expect(screen.getByTestId("play-button")).toBeInTheDocument();
    });

    it("does not render PlayButton if removePlayButton=true", () => {
      renderComponent({ removePlayButton: true });
      const videoEl = screen.getByTestId("video") as HTMLVideoElement;
      fireEvent.loadedData(videoEl);
      expect(screen.queryByTestId("play-button")).toBeNull();
    });

    it("does not render PlayButton if enableControls=true", () => {
      renderComponent({ enableControls: true });
      const videoEl = screen.getByTestId("video") as HTMLVideoElement;
      fireEvent.loadedData(videoEl);
      expect(screen.queryByTestId("play-button")).toBeNull();
    });

    it("renders MediaBlurHash on error", () => {
      renderComponent();
      const videoEl = screen.getByTestId("video") as HTMLVideoElement;
      fireEvent.error(videoEl);
      expect(screen.getByTestId("media-blurhash")).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("calls onClick when video is clicked", () => {
      const onClick = vi.fn();
      renderComponent({ onClick });
      const videoEl = screen.getByTestId("video") as HTMLVideoElement;
      fireEvent.click(videoEl);
      expect(onClick).toHaveBeenCalled();
    });
  });
});
