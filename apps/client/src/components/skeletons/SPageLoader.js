import React from "react";
import { motion as m } from "framer-motion";
import { Oval } from "react-loader-spinner";

export default function SPageLoader() {
  return (
    <m.div
      className="flex flex-1 pl-[30px] justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
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
  );
}
