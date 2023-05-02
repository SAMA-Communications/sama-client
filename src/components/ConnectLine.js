import { default as EventEmitter } from "../event/eventEmitter";
import { motion as m } from "framer-motion";
import { useMemo, useState } from "react";

import "./../styles/ConnectLine.css";

export default function ConnectLine() {
  const [isSocketConnect, setIsSocketConnect] = useState(null);
  if (isSocketConnect === null) {
    EventEmitter.subscribe("onConnect", () => setIsSocketConnect(true));
    EventEmitter.subscribe("onDisconnect", () => setIsSocketConnect(false));
  }

  const visibleLine = useMemo(() => {
    return isSocketConnect ? (
      <></>
    ) : (
      <m.div
        variants={{
          hidden: {
            marginTop: "-28px",
            transition: { duration: 0.3 },
          },
          visible: {
            marginTop: "0",
            transition: { duration: 0.3 },
          },
          exit: {
            marginTop: "-28px",
            transition: { duration: 0.3 },
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
