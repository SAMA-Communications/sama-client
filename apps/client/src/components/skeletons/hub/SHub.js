import Skeleton from "react-loading-skeleton";
import { motion as m } from "framer-motion";

import CustomScrollBar from "@components/_helpers/CustomScrollBar";

import SChatList from "@skeletons/hub/SChatList";

export default function SHub({ animateOptions = () => {}, isReverse }) {
  return (
    <m.section
      className="p-[30px] md:mr-[20px] md:my-[20px]  flex flex-1 flex-row gap-[15px] md:rounded-[48px] bg-(--color-bg-light)"
      initial={{ opacity: isReverse ? 1 : 0 }}
      animate={{
        scale: isReverse ? [1, 1.01, 0.6] : [0.6, 1.01, 1],
        opacity: isReverse ? [1, 0.3, 0] : [0, 0.3, 1],
      }}
      transition={{ duration: isReverse ? 0.5 : 0.8 }}
      onAnimationStart={() => animateOptions(false)}
      onAnimationComplete={() => setTimeout(() => animateOptions(true), 1000)}
    >
      <div className="w-[400px] mt-[5px] flex gap-[10px] flex-col justify-start items-center max-md:w-full max-xl:w-full max-xl:flex-1">
        <Skeleton width={360} height={46} />
        <CustomScrollBar>
          <SChatList />
        </CustomScrollBar>
      </div>
    </m.section>
  );
}
