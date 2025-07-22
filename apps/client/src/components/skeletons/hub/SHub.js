import Skeleton from "react-loading-skeleton";
import * as m from "motion/react-m";
import { useAnimate } from "motion/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import CustomScrollBar from "@components/_helpers/CustomScrollBar";

import { getIsMobileView } from "@store/values/IsMobileView.js";

import SChatList from "@skeletons/hub/SChatList";

export default function SHub({ animateOptions = () => {} }) {
  const [sHubRef, animateSHub] = useAnimate();

  const isMobileView = useSelector(getIsMobileView);

  useEffect(() => {
    animateOptions(false);
    animateSHub([
      [
        sHubRef.current,
        {
          scale: [0.6, 1.01, 1],
          opacity: [0, 0.3, 1],
          ...(isMobileView ? { borderRadius: [48, 0] } : {}),
        },
        { duration: 0.8 },
      ],
    ]);
  }, []);

  return (
    <m.section
      ref={sHubRef}
      className="p-[30px] md:mr-[20px] md:my-[20px]  flex flex-1 flex-row gap-[15px] md:rounded-[48px] bg-(--color-bg-light)"
      initial={{ opacity: 0 }}
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
