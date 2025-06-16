import * as m from "motion/react-m";
import { useSelector } from "react-redux";

import { getNetworkState } from "@store/values/NetworkState";

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
      className="absolute top-0 w-screen h-[28px] bg-(--color-accent-dark) shadow-md z-1000"
    >
      <p className="text-center font-light text-[18px] text-white">
        Connecting...
      </p>
    </m.div>
  );
}
