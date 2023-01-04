const loginBox = {
  hidden: {
    width: 0,
    boxShadow: 0,
    marginRight: "-200px",
  },
  visible: {
    width: "min(98vw, 1000px)",
    marginRight: 0,
    opacity: 1,
    boxShadow: "0px 0px 60px 30px var(--shadow-block)",
    transition: { duration: 0.7 },
  },
  exit: {
    width: 0,
    boxShadow: 0,
    marginRight: "-200px",
    transition: { duration: 0.5 },
  },
};

const createChatButton = {
  hidden: { opacity: 0, marginBottom: "-10px" },
  visible: {
    opacity: 1,
    marginBottom: 0,
    transition: { delay: 1, duration: 0.5 },
  },
  exit: { opacity: 0, transition: { delay: 0, duration: 0 } },
};

const changeOpacity = (inDelay, inDuration, outDelay, outDuration) => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: inDelay, duration: inDuration },
    },
    exit: {
      opacity: 0,
      transition: { delay: outDelay, duration: outDuration },
    },
  };
};

const scaleAndRound = (
  inBorderRarius,
  inDelay,
  inDuration,
  outDelay,
  outDuration
) => {
  return {
    hidden: {},
    visible: {
      scale: [0, 1, 1],
      borderRadius: [`${inBorderRarius}px`, "20px"],
      transition: { delay: inDelay, duration: inDuration },
      transitionEnd: { borderRadius: "var(--border-main-radius)" },
    },
    exit: {
      transition: { delay: outDelay, duration: outDuration },
    },
  };
};

export { loginBox, createChatButton, changeOpacity, scaleAndRound };
