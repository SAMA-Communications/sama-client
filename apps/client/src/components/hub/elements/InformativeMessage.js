import * as m from "motion/react-m";
import { useLocation } from "react-router";

import { addSuffix } from "@utils/NavigationUtils.js";

export default function InformativeMessage({
  text,
  params,
  isPrevMesssageUsers,
}) {
  const { pathname, hash } = useLocation();

  return (
    <m.div
      whileInView={{ y: 0 }}
      initial={{ y: 5 }}
      transition={{ duration: 0.3, delay: 0.03 }}
      className={
        "self-center py-[6px] px-[18px] rounded-[16px] bg-(--color-hover-light) cursor-pointer text-gray-500" +
        (isPrevMesssageUsers ? " mt-[10px]" : "")
      }
      onClick={() =>
        addSuffix(pathname + hash, `/user?uid=${params?.user?._id}`)
      }
    >
      <p>{text}</p>
    </m.div>
  );
}
