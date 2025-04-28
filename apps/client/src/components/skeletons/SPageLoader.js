import React from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import { Oval } from "react-loader-spinner";

export default function SPageLoader() {
  return (
    <AnimatePresence initial={false} mode="wait">
      <m.div
        className="flex flex-1 pl-[30px] justify-center items-center"
        initial={{ opacity: 0, transition: { duration: 3 } }}
        animate={{ opacity: 1, transition: { duration: 3 } }}
        exit={{ opacity: 0, transition: { duration: 3 } }}
      >
        <Oval
          height={100}
          width={100}
          color="var(--color-accent-dark)"
          wrapperStyle={{}}
          wrapperClass={{}}
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="var(--color-accent-dark)"
          strokeWidth={2}
          strokeWidthSecondary={3}
        />
      </m.div>
    </AnimatePresence>
  );
}
