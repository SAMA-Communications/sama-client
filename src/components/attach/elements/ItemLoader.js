import OvalLoader from "@components/_helpers/OvalLoader";
import { Blurhash } from "react-blurhash";

export default function ItemLoader({ blurHash, isShowLoader = true }) {
  return (
    <div className="blur-hash-preloader">
      <Blurhash
        className="canvas-preloader"
        hash={blurHash || "LEHLk~WB2yk8pyo0adR*.7kCMdnj"}
        width={"100%"}
        height={"100%"}
        resolutionX={32}
        resolutionY={32}
      />
      {isShowLoader ? <OvalLoader height={50} width={50} /> : null}
    </div>
  );
}
