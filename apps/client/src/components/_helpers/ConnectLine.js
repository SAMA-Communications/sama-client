import { getNetworkState } from "@store/values/NetworkState";
import { motion } from "motion/react";
import { useSelector } from "react-redux";

export default function ConnectLine() {
  const isSocketConnected = useSelector(getNetworkState);

  if (isSocketConnected) {
    return null;
  }

  return (
    <motion.div
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
    </motion.div>
  );
}
