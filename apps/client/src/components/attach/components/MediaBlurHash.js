import { Blurhash } from "react-blurhash";
import { Oval } from "react-loader-spinner";

import { DEFAULT_BLUR_HASH } from "@utils/constants.js";

import Error from "@icons/options/Error.svg?react";

export default function MediaBlurHash({ status, blurHash }) {
  return (
    <div className="w-full h-full object-cover absolute inset-0">
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
          <Error className={"w-[50px] h-[50px]"} />
        ) : (
          <Oval
            height={50}
            width={50}
            color="#1a8ee1"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#8dc7f0"
            strokeWidth={2}
            strokeWidthSecondary={3}
          />
        )}
      </div>
    </div>
  );
}
