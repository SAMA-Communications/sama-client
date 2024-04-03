import OvalLoader from "@src/components/_helpers/OvalLoader";
import { Blurhash } from "react-blurhash";

export default function ItemLoader({ blurHash }) {
  return (
    <div className="blur-hash-preloader">
      <Blurhash
        className="canvas-preloader"
        hash={blurHash || "LEHLk~WB2yk8pyo0adR*.7kCMdnj"}
        width={70}
        height={70}
        resolutionX={32}
        resolutionY={32}
      />
      <OvalLoader height={50} width={50} />
    </div>
  );
}
