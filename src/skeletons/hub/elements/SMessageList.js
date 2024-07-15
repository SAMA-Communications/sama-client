import { domAnimation, LazyMotion, motion as m } from "framer-motion";
import { animateSMessageList } from "@src/animations/animateSkeletons";

import SChatMessage from "@skeletons/hub/elements/SChatMessage";

export default function SMessageList() {
  return (
    <m.div
      className="infinite-scroll-component__outerdiv"
      variants={animateSMessageList}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div
        className="infinite-scroll-component"
        id="1"
        style={{ height: "auto", overflow: "auto" }}
      >
        <LazyMotion features={domAnimation}>
          <SChatMessage />
          <SChatMessage />
          <SChatMessage />
          <SChatMessage />
          <SChatMessage />
          <SChatMessage />
        </LazyMotion>
      </div>
    </m.div>
  );
}
