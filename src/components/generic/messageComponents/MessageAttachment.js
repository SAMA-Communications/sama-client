import { motion as m } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function MessageAttachment({ id, url, name }) {
  const { hash } = useLocation();
  const navigate = useNavigate();

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
      <m.img
        loading="lazy"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        src={url}
        alt={name}
      />
    </div>
  );
}
