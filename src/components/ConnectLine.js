import { getConnectState } from "../store/ConnectState";
import { motion as m } from "framer-motion";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import "./../styles/ConnectLine.css";

export default function ConnectLine() {
  const isSocketConnected = useSelector(getConnectState);

  const visibleLine = useMemo(() => {
    return isSocketConnected ? (
      <></>
    ) : (
      <m.div
        variants={{
          hidden: { marginTop: "-28px" },
          visible: { marginTop: "0", transition: { duration: 0.3 } },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="connect-line"
      >
        <p className="connect-line-text">Connecting...</p>
      </m.div>
    );
  }, [isSocketConnected]);

  return visibleLine;
}
