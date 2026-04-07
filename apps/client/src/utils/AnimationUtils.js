export const showChatInfoContainer = (isMobileView) =>
  isMobileView
    ? {}
    : {
        hidden: {
          width: 0,
          scale: 0.9,
          opacity: 0,
          marginRight: 0,
          transition: { duration: 0.4 },
        },
        visible: {
          width: 400,
          scale: 1,
          opacity: 1,
          marginRight: isMobileView ? 0 : 15,
          transition: { duration: 0.4 },
        },
        exit: {
          width: 0,
          scale: 0.9,
          opacity: 0,
          marginRight: 0,
          transition: { duration: 0.4 },
        },
      };

export const showChatInfoContent = (isMobileView) =>
  isMobileView
    ? {}
    : {
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: { duration: 0.2, delay: 0.2 },
        },
        exit: {
          opacity: 0,
          transition: { duration: 0.2 },
        },
      };

export const showItem = (index, isReverse, disableAnimation) =>
  disableAnimation
    ? {}
    : {
        hidden: isReverse ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 },
        visible: {
          ...(isReverse
            ? { scale: 0.5, opacity: 0 }
            : {
                scale: 1,
                opacity: 1,
              }),
          transition: {
            duration: 0.5,
            delay: isReverse ? 0 : 0.1 + index * 0.09,
          },
        },
        tap: { scale: 0.85 },
      };

export const showLogoOptions = (isReverse) => ({
  hidden: isReverse ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 },
  visible: isReverse
    ? { opacity: 0, scale: 0.5 }
    : {
        opacity: 1,
        scale: [0.5, 1.2, 1],
        transition: { duration: 0.5, delay: 0.1 },
      },
});

export const showOtherUserProfileContainer = (isMobileView) =>
  isMobileView
    ? {}
    : {
        hidden: { backgroundColor: "rgba(0, 0, 0, 0)" },
        visible: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        exit: { backgroundColor: "rgba(0, 0, 0, 0)" },
        transition: { duration: 0.2 },
      };

export const showOtherUserProfileContent = (isMobileView) =>
  isMobileView
    ? {}
    : {
        hidden: {
          y: -100,
          scale: 0.8,
          opacity: 0,
        },
        visible: {
          y: 0,
          scale: 1,
          opacity: 1,
          transition: { delay: 0.1 },
        },
        exit: {
          y: -100,
          scale: 0.8,
          opacity: 0,
        },
        transition: { duration: 0.2 },
      };

export const showUserProfileContainer = (isMobileView) =>
  isMobileView
    ? {}
    : {
        hidden: {
          width: 0,
          scale: 0.9,
          opacity: 0,
          marginRight: 0,
          transition: { duration: 0.4 },
        },
        visible: {
          width: 400,
          scale: 1,
          opacity: 1,
          marginRight: isMobileView ? 0 : 15,
          transition: { duration: 0.4 },
        },
        exit: {
          width: 0,
          scale: 0.9,
          opacity: 0,
          marginRight: 0,
          transition: { duration: 0.4 },
        },
      };

export const showUserProfileContent = (isMobileView) =>
  isMobileView
    ? {}
    : {
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: { duration: 0.2, delay: 0.2 },
        },
        exit: {
          opacity: 0,
          transition: { duration: 0.2 },
        },
      };

/** Tablet: right panel (ChatInfo / OtherUserProfile) slides in from the right edge */
export const showRightPanelSlide = {
  hidden: { x: "100%", transition: { duration: 0.3 } },
  visible: { x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { x: "100%", transition: { duration: 0.25 } },
};

/** Tablet: left panel (ChatList) expands/collapses by width so chat panel resizes smoothly (no empty gap) */
export const showLeftPanelWidth = {
  hidden: { width: 0, minWidth: 0, opacity: 0, transition: { duration: 0.3 } },
  visible: { width: 400, minWidth: 400, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { width: 0, minWidth: 0, opacity: 0, transition: { duration: 0.25 } },
};

/** Tablet: chat panel stays in flow; list width animation handles the resize so no separate chat animation needed */
export const showChatPanelSlide = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
