import { useMemo, useRef, useState } from "react";
import { Blurhash } from "react-blurhash";
import { useLocation, useNavigate } from "react-router-dom";

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
    const video = <video ref={videoRef} controls src={url} poster={name} />;

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
      <Blurhash
        className="canvas-preloader"
        key={id}
        hash={blurHash}
        width={400}
        height={300}
        resolutionX={32}
        resolutionY={32}
      />
    );
  }, [loaded, localUrl, blurHash]);

  return (
    <div
      className="attachment-img"
      onClick={() => {
        navigate(hash + `/modal?id=${id.replaceAll(" ", "%")}`);
        videoRef.current &&
          localStorage.setItem(
            "currentTimeVideo",
            videoRef.current.currentTime
          );
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
