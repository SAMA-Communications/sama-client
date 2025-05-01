import React from "react";
import { motion as m } from "framer-motion";
import { Oval } from "react-loader-spinner";

export default function SPageLoader() {
  return (
    <div className="flex flex-1 pl-[30px] justify-center items-center ">
      <m.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
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
      </m.span>
    </div>
  );
}
