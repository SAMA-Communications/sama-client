import MessageAttachment from "@components/message/elements/MessageAttachment";
import getFileType from "@utils/media/get_file_type";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import { getMessageById } from "@store/values/Messages";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

import "@styles/attach/MediaHub.css";

import { ReactComponent as Prev } from "@icons/options/Prev.svg";
import { ReactComponent as Next } from "@icons/options/Next.svg";

export default function MediaHub() {
  const { pathname, hash } = useLocation();

  const [currentIndex, setCurrentIndex] = useState(() => {
    const [, , index] = hash.split("=");
    return +index;
  });

  const mid = hash.split("=")[1];
  const { attachments = [] } = useSelector((state) =>
    getMessageById(state, mid)
  );

  const isLastIndex = currentIndex === attachments.length - 1;
  const isFirstIndex = currentIndex === 0;

  const closeModal = () => {
    removeAndNavigateLastSection(pathname + hash);
  };

  return (
    <div className="media-window__container fcc" onClick={closeModal}>
      <div className="media-modal__content fcc">
        <MessageAttachment
          url={attachments[currentIndex]?.file_url}
          name={attachments[currentIndex]?.file_name}
        />
      </div>
      {!isFirstIndex && (
        <div
          className="media-modal__prev fcc"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex - 1);
          }}
        >
          <Prev />
        </div>
      )}
      {!isLastIndex && (
        <div
          className="media-modal__next fcc"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex + 1);
          }}
        >
          <Next />
        </div>
      )}
      <div className="media-modal__list">
        {attachments.map((file, i) => (
          <div
            key={i}
            className={`mm-list__item${
              i === currentIndex ? "--active" : ""
            } fcc`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
          >
            {getFileType(file.file_name) === "Video" ? (
              <video src={file.file_url} alt={file.file_name} />
            ) : (
              <img src={file.file_url} alt={file.file_name} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
