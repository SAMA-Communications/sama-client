import MessageAttachment from "@components/message/elements/MessageAttachment";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import { selectMessagesEntities } from "@store/values/Messages";
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import "@styles/attach/MediaHub.css";

import { ReactComponent as Prev } from "@icons/options/Prev.svg";
import { ReactComponent as Next } from "@icons/options/Next.svg";

export default function MediaHub() {
  const { pathname, hash } = useLocation();
  const [, mid, index] = useMemo(() => hash.split("="), [hash]);
  const messages = useSelector(selectMessagesEntities);

  const [curretnIndex, setCurretnIndex] = useState(+index);

  const attachments = useMemo(() => {
    const currentMessage = messages[mid];
    return currentMessage.attachments;
  }, [messages, mid]);

  const isLastIndex = curretnIndex === attachments.length - 1;
  const isFirstIndex = curretnIndex === 0;

  const closeModal = () => {
    removeAndNavigateLastSection(pathname + hash);
  };

  return (
    <div className="media-window__container fcc" onClick={closeModal}>
      <div className="media-modal__content fcc">
        <MessageAttachment
          url={attachments[curretnIndex].file_url}
          name={attachments[curretnIndex].file_name}
        />
      </div>
      {!isFirstIndex ? (
        <div
          className="media-modal__prev fcc"
          onClick={(e) => {
            e.stopPropagation();
            setCurretnIndex((prev) => --prev);
          }}
        >
          <Prev />
        </div>
      ) : null}
      {!isLastIndex ? (
        <div
          className="media-modal__next fcc"
          onClick={(e) => {
            e.stopPropagation();
            setCurretnIndex((prev) => ++prev);
          }}
        >
          <Next />
        </div>
      ) : null}
      <div className="media-modal__list">
        {attachments.map((file, i) => (
          <div
            key={i}
            className={`mm-list__item${
              i === curretnIndex ? "--active" : ""
            } fcc`}
            onClick={(e) => {
              e.stopPropagation();
              setCurretnIndex(i);
            }}
          >
            <img src={file.file_url} alt={file.file_name} />
          </div>
        ))}
      </div>
    </div>
  );
}
