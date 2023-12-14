import { motion as m } from "framer-motion";
import { useState } from "react";
import { Blurhash } from "react-blurhash";
import { useLocation, useNavigate } from "react-router-dom";

export default function MessageAttachment({ id, url, name, blurHash }) {
  const { hash } = useLocation();
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);

  const attachmentPreloader = (key, hash) => {
    if (!hash) {
      return <div key={key} className="attachment-preloader"></div>;
    }
    return (
      <Blurhash
        className="canvas-preloader"
        key={key}
        hash={hash}
        width={400}
        height={300}
        resolutionX={32}
        resolutionY={32}
        punch={1}
      />
    );
  };

  return name.includes(".mp4") ? (
    <div
      className="attachment-img"
      onClick={() => navigate(hash + `/modal?id=${id.replaceAll(" ", "%")}`)}
    >
      <video controls src={url} poster={name} />
    </div>
  ) : (
    <div
      className="attachment-img"
      onClick={() => navigate(hash + `/modal?id=${id.replaceAll(" ", "%")}`)}
    >
      {/* !!! DOUBLE LOADING???? !!! */}
      <m.img
        style={loaded ? {} : { display: "none" }}
        onLoad={() => setLoaded(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        src={url}
        alt={name}
      />
      {loaded ? null : attachmentPreloader(id, blurHash)}
    </div>
  );
}
