import { FC } from "react";
import { Blurhash } from "react-blurhash";
import { ImageLoaderProps } from "./ImageLoader.types";
import { OvalLoader } from "../OvalLoader";

export const ImageLoader: FC<ImageLoaderProps> = ({
  blurHash = "LEHLk~WB2yk8pyo0adR*.7kCMdnj",
  isShowLoader = true,
}) => {
  return (
    <div
      data-testid="image-loader"
      className="relative w-full h-full overflow-hidden rounded-lg"
    >
      <Blurhash
        hash={blurHash}
        width={"100%"}
        height={"100%"}
        resolutionX={32}
        resolutionY={32}
        punch={1}
      />
      {isShowLoader && (
        <div className="absolute inset-0 flex items-center justify-center">
          <OvalLoader height={35} width={35} />
        </div>
      )}
    </div>
  );
};
