import { Blurhash } from "react-blurhash";
import { Oval } from "react-loader-spinner";

import { AlertCircle } from "lucide-react";

import { MediaBlurHashProps } from "./MediaBlurHash.types";

export const DEFAULT_BLUR_HASH = "U27nLE$*00_N^k,@s9xu#7$2$%xtVD-B-pkW";

export const MediaBlurHash = ({
  status = "loading",
  blurHash,
  loaderColor = "#1a8ee1",
  loaderSecondaryColor = "#8dc7f0",
  loaderSize = 50,
}: MediaBlurHashProps) => {
  return (
    <div data-testid="ui:media-blurhash" className="h-full ui:absolute ui:inset-0 ui:w-full ui:object-cover">
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
      <div className="ui:absolute ui:inset-0 ui:flex ui:h-full ui:w-full ui:items-center ui:justify-center">
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
