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

export { loginBox };
