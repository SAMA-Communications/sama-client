import OvalLoader from "@components/_helpers/OvalLoader";
import { Blurhash } from "react-blurhash";

export default function ItemLoader({ blurHash, isShowLoader = true }) {
  return (
    <div className="relative w-full h-full">
      <Blurhash
        hash={blurHash || "LEHLk~WB2yk8pyo0adR*.7kCMdnj"}
        width={"100%"}
        height={"100%"}
        resolutionX={32}
        resolutionY={32}
      />
      {isShowLoader ? (
        <OvalLoader
          customClassName={
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          }
          height={35}
          width={35}
        />
      ) : null}
    </div>
  );
}
