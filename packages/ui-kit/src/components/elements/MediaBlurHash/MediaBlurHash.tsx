import { AlertCircle } from "lucide-react";
import { Blurhash } from "react-blurhash";
import { Oval } from "react-loader-spinner";

import { MediaBlurHashProps } from "@elements/MediaBlurHash/MediaBlurHash.types";

import { DEFAULT_BLUR_HASH } from "@utils/constants";

export { DEFAULT_BLUR_HASH } from "../../../utils/constants";

export const MediaBlurHash = ({
  status = "loading",
  blurHash,
  loaderColor = "#1a8ee1",
  loaderSecondaryColor = "#8dc7f0",
  loaderSize = 50,
}: MediaBlurHashProps) => {
  return (
    <div data-testid="media-blurhash" className="ui:h-75 ui:w-87.5 ui:object-cover">
      <Blurhash
        className="ui:static! ui:h-75! ui:w-87.5! ui:flex-1 ui:object-cover"
        hash={blurHash || DEFAULT_BLUR_HASH}
        resolutionX={32}
        resolutionY={32}
      />
      <div className="ui:absolute ui:inset-0 ui:flex ui:h-full ui:w-full ui:items-center ui:justify-center">
        {status === "error" ? (
          <AlertCircle className="ui:h-12.5 ui:w-12.5" color="#f87171" />
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
