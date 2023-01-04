import React from "react";
import { changeOpacity } from "../../styles/animations/animationBlocks";
import { motion as m } from "framer-motion";

export default function SearchedUser({ uLogin, onClick }) {
  return (
    <m.div
      variants={changeOpacity(0, 0.3, 0, 0.3)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={"list-user-box"}
      onClick={onClick}
    >
      <p>User: {uLogin}</p>
    </m.div>
  );
}
