const showChatInfoContainer = (isMobileView) =>
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

const showChatInfoContent = (isMobileView) =>
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

export { showChatInfoContainer, showChatInfoContent };
