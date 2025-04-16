import { Blurhash } from "react-blurhash";
import { Oval } from "react-loader-spinner";
import { useMemo, useState } from "react";

export default function ImageView({ url, localUrl, blurHash, altName }) {
  const [loaded, setLoaded] = useState(false);

  const preloaderView = useMemo(() => {
    if (loaded || !blurHash) {
      return null;
    }

    return localUrl ? (
      <img src={localUrl} alt={altName} />
    ) : (
      <div className="blur-hash-preloader">
        <Blurhash
          className="canvas-preloader"
          hash={blurHash}
          width={400}
          height={300}
          resolutionX={32}
          resolutionY={32}
        />
        <Oval
          height={50}
          width={50}
          color="#1a8ee1"
          wrapperClass={"blur-hash-loader"}
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#8dc7f0"
          strokeWidth={2}
          strokeWidthSecondary={3}
        />
      </div>
    );
  }, [loaded, localUrl, blurHash]);

  return (
    <>
      <img
        className={`max-w-full max-h-full ${loaded ? "block" : "hidden"}`}
        onLoad={() => setLoaded(true)}
        src={url}
        alt={altName}
      />
      {preloaderView}
    </>
  );
}
