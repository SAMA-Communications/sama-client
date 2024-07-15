const animateConversationItem = (i) => ({
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 + 0.05 * i },
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: { duration: 0.3, delay: -0.05 * i },
  },
});

const animateConversationList = {
  hidden: {
    width: 0,
    opacity: 0,
  },
  visible: {
    width: 400,
    opacity: [0, 0, 1, 1],
    transition: { duration: 0.7, times: [0, 0.1, 0.7, 1], ease: "easeInOut" },
  },
  exit: {
    width: 0,
    opacity: [1, 1, 0, 0],
    transition: { duration: 0.7, times: [0, 0.1, 0.7, 1], ease: "easeInOut" },
  },
};

export { animateConversationItem, animateConversationList };
