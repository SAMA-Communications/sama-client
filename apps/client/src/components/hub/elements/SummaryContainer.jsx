import { useDispatch, useSelector } from "react-redux";

import { SummaryContainer as UISummaryContainer } from "@sama-communications.ui-kit";

import { getConverastionById, upsertChat } from "@store/values/Conversations.js";
import { SUMMART_FILTER_MESSAGE } from "@utils/constants.js";

export default function SummaryContainer({ summaryContent }) {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(getConverastionById);

  return (
    <UISummaryContainer
      summaryContent={summaryContent}
      onClose={() => dispatch(upsertChat({ _id: selectedConversation._id, summary: null }))}
      getFilterLabel={(filter) => SUMMART_FILTER_MESSAGE[filter] || ""}
    />
  );
}
