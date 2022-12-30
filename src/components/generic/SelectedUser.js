import React from "react";
import { motion as m } from "framer-motion";

import { ReactComponent as CloseButtonMini } from "./../../assets/icons/chatForm/CloseButtonMini.svg";

export default function SelectedUser({ uLogin, onClick }) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0, duration: 0.3 } }}
      exit={{ opacity: 0, transition: { delay: 0, duration: 0.3 } }}
      className="list-user-selected-box"
      onClick={onClick}
    >
      <p>{uLogin}</p>
      <CloseButtonMini />
    </m.div>
  );
}
