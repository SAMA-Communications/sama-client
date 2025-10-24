import { FC } from "react";
import { Blurhash } from "react-blurhash";
import { Oval } from "react-loader-spinner";
import { AlertCircle } from "lucide-react";

import { MediaBlurHashProps } from "./MediaBlurHash.types";

export const DEFAULT_BLUR_HASH = "U27nLE$*00_N^k,@s9xu#7$2$%xtVD-B-pkW";

export const MediaBlurHash: FC<MediaBlurHashProps> = ({
  status = "loading",
  blurHash,
  loaderColor = "#1a8ee1",
  loaderSecondaryColor = "#8dc7f0",
  loaderSize = 50,
}) => {
  return (
    <div
      data-testid="media-blurhash"
      className="w-full h-full object-cover absolute inset-0"
    >
      <Blurhash
        hash={blurHash || DEFAULT_BLUR_HASH}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          inset: 0,
        }}
        resolutionX={32}
        resolutionY={32}
      />
      <div className="flex items-center justify-center w-full h-full absolute inset-0">
        {status === "error" ? (
          <AlertCircle className="w-[50px] h-[50px]" color="#f87171" />
        ) : (
          <Oval
            height={loaderSize}
            width={loaderSize}
            color={loaderColor}
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor={loaderSecondaryColor}
            strokeWidth={2}
            strokeWidthSecondary={3}
          />
        )}
      </div>
    </div>
  );
};
