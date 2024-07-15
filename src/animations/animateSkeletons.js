const animateSMessageList = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.15 },
  },
  exit: {
    opacity: 0,
    x: -15,
    transition: { duration: 0.3, delay: 0.15 },
  },
};

const animateSConversationItem = (i) => ({
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.15 + 0.05 * i },
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: { duration: 0.3, delay: -0.05 * i },
  },
});

export { animateSMessageList, animateSConversationItem };
