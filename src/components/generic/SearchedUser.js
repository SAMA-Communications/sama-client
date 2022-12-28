import React from "react";
import { motion as m } from "framer-motion";

export default function SearchedUser({ uLogin, onClick }) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0, duration: 0.3 } }}
      exit={{ opacity: 0, transition: { delay: 0, duration: 0.3 } }}
      className={"list-user-box"}
      onClick={onClick}
    >
      <p>User: {uLogin}</p>
    </m.div>
  );
}
