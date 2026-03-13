import { Blurhash } from "react-blurhash";

import { ImageLoaderProps } from "@elements/ImageLoader/ImageLoader.types";
import { OvalLoader } from "@elements/OvalLoader";

export const ImageLoader = ({ blurHash = "LEHLk~WB2yk8pyo0adR*.7kCMdnj", isShowLoader = true }: ImageLoaderProps) => {
  return (
    <div data-testid="image-loader" className="ui:relative ui:h-full ui:w-full ui:overflow-hidden ui:rounded-lg">
      <Blurhash hash={blurHash} width={"100%"} height={"100%"} resolutionX={32} resolutionY={32} punch={1} />
      {isShowLoader && (
        <div className="ui:absolute ui:inset-0 ui:flex ui:items-center ui:justify-center">
          <OvalLoader height={35} width={35} />
        </div>
      )}
    </div>
  );
};

