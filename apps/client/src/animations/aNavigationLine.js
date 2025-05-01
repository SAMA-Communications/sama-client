const showItem = (index, isReverse, disableAnimation) =>
  disableAnimation
    ? {}
    : {
        hidden: isReverse
          ? { scale: 1, opacity: 1 }
          : { scale: 0.5, opacity: 0 },
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

const showLogoOptions = (isReverse) => ({
  hidden: isReverse ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 },
  visible: isReverse
    ? { opacity: 0, scale: 0.5 }
    : {
        opacity: 1,
        scale: [0.5, 1.2, 1],
        transition: { duration: 0.5, delay: 0.1 },
      },
});

export { showItem, showLogoOptions };
