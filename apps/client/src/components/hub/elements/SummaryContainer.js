import * as m from "motion/react-m";
import { useDispatch, useSelector } from "react-redux";

import {
  getConverastionById,
  upsertChat,
} from "@store/values/Conversations.js";

import OvalLoader from "@components/_helpers/OvalLoader.js";

import globalConstants from "@utils/global/constants.js";

import Close from "@icons/actions/Close.svg?react";
import MagicWand from "@icons/ai/MagicWandWhite.svg?react";

export default function SummaryContainer({ summaryContent }) {
  const dispatch = useDispatch();

  const selectedConversation = useSelector(getConverastionById);

  if (!summaryContent) return null;

  const { isLoading, text, filter } = summaryContent;

  const onClose = () =>
    dispatch(upsertChat({ _id: selectedConversation._id, summary: null }));

  return (
    <m.div
      className="absolute right-[10px] top-1/2 -translate-y-1/2 max-w-[350px] p-[15px] rounded-[16px] bg-black/65 text-white text-end z-45"
      initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      animate={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
      exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center">
        <span className="text-span text-gray-300">
          Only you can see this summary
        </span>
        <Close className="w-[15px] h-[15px] cursor-pointer" onClick={onClose} />
      </div>
      <div className="flex items-center gap-[7px]">
        <MagicWand className="w-[22px] h-[22px]" />
        <p className="text-h6 my-[8px]">
          <b>Here's what you missed: </b>
        </p>
      </div>
      <div className="max-h-[400px] rounded-[8px] flex flex-col text-left overflow-auto">
        {isLoading ? (
          <OvalLoader
            width={35}
            height={35}
            customClassName="my-[10px] self-center"
          />
        ) : (
          <p>{text}</p>
        )}
      </div>
      <span className="mt-[9px] ml-auto text-span text-gray-300">
        {globalConstants.summaryFilterMessage[filter] || ""}
      </span>
    </m.div>
  );
}
