import React from "react";
import { changeOpacity } from "@styles/animations/animationBlocks";
import { motion as m } from "framer-motion";

import { ReactComponent as CloseButtonMini } from "@icons/chatForm/CloseButtonMini.svg";

export default function SelectedUser({ uLogin, onClick }) {
  return (
    <m.div
      variants={changeOpacity(0, 0.3, 0, 0.3)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="list-user-selected-box"
      onClick={onClick}
    >
      <p>{uLogin}</p>
      <CloseButtonMini />
    </m.div>
  );
}
