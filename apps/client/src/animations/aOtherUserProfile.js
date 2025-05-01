const showOtherUserProfileContainer = (isMobileView) =>
  isMobileView
    ? {}
    : {
        hidden: { backgroundColor: "rgba(0, 0, 0, 0)" },
        visible: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        exit: { backgroundColor: "rgba(0, 0, 0, 0)" },
        transition: { duration: 0.2 },
      };

const showOtherUserProfileContent = (isMobileView) =>
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

export { showOtherUserProfileContent, showOtherUserProfileContainer };
