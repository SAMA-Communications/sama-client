import { animateSConversationItem } from "@src/animations/animateSkeletons";
import { motion as m } from "framer-motion";

import Skeleton from "react-loading-skeleton";

export default function SConversationItem({ index }) {
  return (
    <m.div
      className="chat-box__container"
      variants={animateSConversationItem(index)}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="box__photo fcc">
        <Skeleton height={70} width={70} />
      </div>
      <div className="box__content">
        <div className="content-top">
          <p className="content-top__name">
            <Skeleton width={120} />
          </p>
          <div className="content-top__time">
            <Skeleton width={60} />
          </div>
        </div>
        <div className="content-bottom">
          <Skeleton containerClassName="flex-grow-1" />
        </div>
      </div>
    </m.div>
  );
}
