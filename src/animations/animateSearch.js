const animateSearchBar = {
  hidden: {
    width: 0,
    opacity: 0,
  },
  visible: {
    width: 360,
    opacity: [0, 0, 1, 1],
    transition: { duration: 0.7, times: [0, 0.1, 0.7, 1], ease: "easeInOut" },
  },
  exit: {
    width: 0,
    opacity: [1, 1, 0, 0],
    transition: { duration: 0.7, times: [0, 0.1, 0.7, 1], ease: "easeInOut" },
  },
};

export { animateSearchBar };
