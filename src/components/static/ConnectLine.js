import { default as EventEmitter } from "../../event/eventEmitter";
import { motion as m } from "framer-motion";
import { useMemo, useState } from "react";

import "./../../styles/ConnectLine.css";

export default function ConnectLine() {
  const [isSocketConnect, setIsSocketConnect] = useState(false);
  EventEmitter.subscribe("setConnectStatus", (v) => setIsSocketConnect(v));

  const visibleLine = useMemo(() => {
    return isSocketConnect ? (
      <></>
    ) : (
      <m.div
        variants={{
          hidden: {
            marginTop: "-28px",
          },
          visible: {
            marginTop: "0",
            transition: { duration: 0.7 },
          },
          exit: {
            marginTop: "-28px",
            transition: { duration: 0.5 },
          },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="connect-line"
      >
        <p className="connect-line-text">Connection...</p>
      </m.div>
    );
  }, [isSocketConnect]);

  return visibleLine;
}
