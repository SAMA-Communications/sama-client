import { useRef, useState } from "react";

import { useLocation } from "react-router";

import { useSelector } from "react-redux";

import { useKeyDown } from "@hooks/tools/useKeyDown";
import { useTouchScreen } from "@hooks/tools/useTouchScreen";

import { MediaViewer, useViewportBreakpoints } from "@sama-communications.ui-kit";

import { getMessageById } from "@store/values/Messages";

import { KEY_CODES } from "@utils/constants.js";
import { getFileType } from "@utils/MediaUtils.js";
import { removeAndNavigateLastSection } from "@utils/NavigationUtils.js";

export default function MediaHub() {
  const { pathname, hash } = useLocation();
  const { isMobile } = useViewportBreakpoints();
  const swipedBlockRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const [, , index] = hash.split("=");
    return +index;
  });

  const mid = hash.split("=")[1];
  const { attachments = [] } = useSelector((state) => getMessageById(state, mid)) || {};

  const closeModal = () => removeAndNavigateLastSection(pathname + hash);

  useKeyDown(KEY_CODES.ESCAPE, closeModal);
  useKeyDown(KEY_CODES.ARROW_RIGHT, () => currentIndex < attachments.length - 1 && setCurrentIndex(currentIndex + 1));
  useKeyDown(KEY_CODES.ARROW_LEFT, () => currentIndex > 0 && setCurrentIndex(currentIndex - 1));

  useTouchScreen(swipedBlockRef, {
    left: () => currentIndex < attachments.length - 1 && setCurrentIndex(currentIndex + 1),
    right: () => currentIndex > 0 && setCurrentIndex(currentIndex - 1),
    down: closeModal,
    up: closeModal,
  });

  return (
    <MediaViewer
      attachments={attachments}
      currentIndex={currentIndex}
      onIndexChange={setCurrentIndex}
      onClose={closeModal}
      getFileType={getFileType}
      isMobile={isMobile}
      swipeRef={swipedBlockRef}
    />
  );
}
