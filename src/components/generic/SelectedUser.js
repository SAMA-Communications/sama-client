import React from "react";
import { motion as m } from "framer-motion";

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
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0.353553"
          y1="0.646447"
          x2="8.83883"
          y2="9.13173"
          stroke="white"
        />
        <line
          x1="0.646447"
          y1="9.13168"
          x2="9.13173"
          y2="0.646395"
          stroke="white"
        />
      </svg>
    </m.div>
  );
}
