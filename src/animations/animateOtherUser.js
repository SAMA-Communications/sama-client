const animateOtherUserWindow = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, delay: 0.2, ease: "easeInOut" },
  },
};
const animateOtherUserContainer = (i) => ({
  hidden: {
    y: 10 * (i % 2 ? -1 : 1),
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.2, ease: "easeInOut" },
  },
  exit: {
    y: 10 * (i % 2 ? -1 : 1),
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
});

const animateOtherUserContet = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, delay: 0.5, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};
export {
  animateOtherUserWindow,
  animateOtherUserContainer,
  animateOtherUserContet,
};
