import { useState } from "react";
import { motion as m } from "framer-motion";

export default function MessageAttachment({ url, name }) {
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const modalWindow = () => {
    return (
      <div exit="exit" className="modal-window">
        <img src={url} alt={name} />
      </div>
    );
  };

  return (
    <div
      className="attachment-img"
      onClick={() => (modalOpen ? close() : open())}
    >
      <m.img
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        src={url}
        alt={name}
      />
      {modalOpen && modalWindow()}
    </div>
  );
}
