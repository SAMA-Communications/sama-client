import { motion as m } from "framer-motion";
import { AnimatePresence } from "motion/react";
import { FC } from "react";

import { SocketConnectingLineProps } from "./SocketConnectingLine.types";

export const SocketConnectingLine: FC<SocketConnectingLineProps> = ({
  isSocketConnected,
  message = "Connecting...",
}) => {
  return (
    <AnimatePresence>
      {isSocketConnected ? null : (
        <m.div
          initial={{ marginTop: "-28px" }}
          animate={{ marginTop: "0px" }}
          exit={{ marginTop: "-28px" }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 w-full h-[28px] bg-accent-dark shadow-md z-[1000] flex items-center justify-center"
        >
          <p className="text-center font-light text-[18px] text-white">
            {message}
          </p>
        </m.div>
      )}
    </AnimatePresence>
  );
};
