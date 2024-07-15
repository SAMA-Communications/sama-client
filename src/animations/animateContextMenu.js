const animateContextMenu = {
  hidden: {
    width: 0,
    height: 0,
  },
  visible: {
    width: 240,
    height: "max-content",
    transition: { duration: 0.3 },
  },
  exit: {
    width: 0,
    height: 0,
    transition: { duration: 0.3 },
  },
};

const animateContextLink = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

export { animateContextMenu, animateContextLink };
