import { getNetworkState } from "@store/values/NetworkState";
import { motion as m } from "framer-motion";
import { useSelector } from "react-redux";

export default function ConnectLine() {
  const isSocketConnected = useSelector(getNetworkState);

  if (isSocketConnected) {
    return null;
  }

  return (
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
      <p className="connect-line__text">Connecting...</p>
    </m.div>
  );
}
