const animateUserProfilecontainer = {
  hidden: {
    width: 0,
    opacity: 0,
    marginRight: 0,
  },
  visible: {
    width: 400,
    opacity: [0, 0, 1, 1],
    marginRight: "15px",
    transition: { duration: 0.7, times: [0, 0.1, 0.7, 1], ease: "easeInOut" },
  },
  exit: {
    width: 0,
    opacity: [1, 1, 0, 0],
    marginRight: 0,
    transition: { duration: 0.7, times: [0, 0.1, 0.7, 1], ease: "easeInOut" },
  },
};

const animateUserProfileContent = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, delay: 0.5 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const animateParticipantsInChat = (i) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, delay: 0.5 + 0.05 * i },
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: { duration: 0.2, delay: -0.05 * i },
  },
});

export {
  animateUserProfilecontainer,
  animateUserProfileContent,
  animateParticipantsInChat,
};
