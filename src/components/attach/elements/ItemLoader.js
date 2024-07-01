import OvalLoader from "@components/_helpers/OvalLoader";
import { Blurhash } from "react-blurhash";

export default function ItemLoader({ width = 70, height = 70, blurHash }) {
  return (
    <div className="blur-hash-preloader">
      <Blurhash
        className="canvas-preloader"
        hash={blurHash || "LEHLk~WB2yk8pyo0adR*.7kCMdnj"}
        width={width}
        height={height}
        resolutionX={32}
        resolutionY={32}
      />
      <OvalLoader height={50} width={50} />
    </div>
  );
}
