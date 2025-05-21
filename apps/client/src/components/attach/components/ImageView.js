import { Blurhash } from "react-blurhash";
import { Oval } from "react-loader-spinner";
import { useEffect, useMemo, useState } from "react";

import globalConstants from "@utils/global/constants.js";

import Error from "@icons/options/Error.svg?react";

export default function ImageView({ image, onClickFunc, isFullSize = true }) {
  const [loadStatus, setLoadStatus] = useState("load");

  const { file_name, file_url, file_blur_hash } = image || {};

  const preloaderView = useMemo(() => {
    if (loadStatus === "success") return null;

    return (
      <div className="w-full h-full object-cover absolute inset-0">
        <Blurhash
          hash={file_blur_hash || globalConstants.defaultBlurHash}
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
          {loadStatus === "error" ? (
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
  }, [loadStatus, file_blur_hash]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoadStatus("success");
    img.onerror = () => setLoadStatus("error");
    img.src = file_url;
  }, [file_url]);

  return (
    <>
      <img
        className={`${
          isFullSize ? "w-full h-full" : "max-w-full max-h-full"
        } object-cover`}
        onLoad={() => setLoadStatus("success")}
        onError={() => setLoadStatus("error")}
        onClick={loadStatus !== "error" ? onClickFunc : null}
        alt={file_name}
        src={file_url}
      />
      {preloaderView}
    </>
  );
}
