const animateSVG = (
  strokeLength,
  inDelay,
  inDuration,
  outDelay,
  outDuration
) => {
  return {
    hidden: {
      strokeDasharray: `${strokeLength}px`,
      strokeDashoffset: `${strokeLength}px`,
    },
    visible: {
      strokeDashoffset: 0,
      opacity: 1,
      transition: { delay: inDelay, duration: inDuration },
    },
    exit: {
      opacity: 0,
      transition: { delay: outDelay, duration: outDuration },
    },
  };
};

export { animateSVG };
