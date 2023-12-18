import { Blurhash } from "react-blurhash";
import { Oval } from "react-loader-spinner";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";

export default function MessageAttachment({
  id,
  url,
  name,
  localUrl,
  blurHash,
}) {
  const { hash } = useLocation();
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);

  const videoView = useMemo(() => {
    const video = (
      <video
        ref={videoRef}
        controls
        src={url + "#t=0.1"}
        poster={name}
        onClick={(event) => {
          event.preventDefault();
          videoRef.current.pause();
        }}
      />
    );

    //get first clip from video for bg

    return video;
  }, [url]);

  const preloaderView = useMemo(() => {
    if (loaded || !blurHash) {
      return null;
    }

    return localUrl ? (
      <img src={localUrl} alt={name} />
    ) : (
      <div className="blur-hash-preloader">
        <Blurhash
          className="canvas-preloader"
          key={id}
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
    <div
      className="attachment-img"
      onClick={() => {
        navigate(hash + `/modal?id=${id.replaceAll(" ", "%")}`);
        if (videoRef.current) {
          localStorage.setItem(
            "currentTimeVideo",
            videoRef.current.currentTime
          );
        }
      }}
    >
      {/* !!! DOUBLE LOADING???? !!! */}
      {name.includes(".mp4") ? (
        videoView
      ) : (
        <>
          <img
            style={loaded ? {} : { display: "none" }}
            onLoad={() => setLoaded(true)}
            src={url}
            alt={name}
          />
          {preloaderView}
        </>
      )}
    </div>
  );
}
