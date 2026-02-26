import * as m from "motion/react-m";
import { useDispatch, useSelector } from "react-redux";

import { getConverastionById, upsertChat } from "@store/values/Conversations.js";

import { OvalLoader } from "@sama-communications.ui-kit";

import { SUMMART_FILTER_MESSAGE } from "@utils/constants.js";

import { WandSparkles, X } from "lucide-react";

export default function SummaryContainer({ summaryContent }) {
  const dispatch = useDispatch();

  const selectedConversation = useSelector(getConverastionById);

  if (!summaryContent) return null;

  const { isLoading, text, filter } = summaryContent;

  const onClose = () => dispatch(upsertChat({ _id: selectedConversation._id, summary: null }));

  return (
    <m.div
      className="absolute top-1/2 right-2.5 z-45 max-w-87.5 -translate-y-1/2 rounded-2xl bg-black/85 p-3 text-end text-white"
      initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      animate={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-span text-gray-300">Only you can see this summary</span>
        <X color="white" size={16} className="cursor-pointer" onClick={onClose} />
      </div>
      <div className="flex items-center gap-1.75">
        <WandSparkles size={22} color="white" />
        <p className="my-2 text-xl">
          <b>Here's what you missed: </b>
        </p>
      </div>
      <div className="flex max-h-100 flex-col overflow-auto rounded-lg text-left">
        {isLoading ? <OvalLoader width={35} height={35} customClassName="my-[10px] self-center" /> : <p>{text}</p>}
      </div>
      <span className="text-span mt-2.25 ml-auto text-gray-300">{SUMMART_FILTER_MESSAGE[filter] || ""}</span>
    </m.div>
  );
}
