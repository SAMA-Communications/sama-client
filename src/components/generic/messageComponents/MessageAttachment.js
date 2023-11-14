import { motion as m } from "framer-motion";

export default function MessageAttachment({ url, name, openModalParam }) {
  return (
    <div
      className="attachment-img"
      onClick={() => openModalParam({ url, name })}
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
