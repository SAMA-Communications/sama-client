import * as m from "motion/react-m";
import { useCallback, useState } from "react";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import SearchInput from "@components/static/SearchInput.js";
import SearchBlock from "@components/search/SearchBlock.js";

import {
  selectConversationsEntities,
  updateWithDrafts,
} from "@store/values/Conversations.js";

import extractForwardedMids from "@utils/conversation/extract_forwarded_mids.js";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page.js";

import Close from "@icons/options/Close.svg?react";

export default function ConversationSelectHub({ title }) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const [inputText, setInputText] = useState(null);

  const conversation = useSelector(selectConversationsEntities);

  const onClickFunc = (forwardToCid) => {
    const forwardedMids = extractForwardedMids(hash);
    if (!forwardedMids.length) return;

    const forwardToConversation = conversation[forwardToCid];

    const newDraft = {
      ...(forwardToConversation?.draft || {}),
      forwarded_mids: forwardedMids,
    };

    dispatch(updateWithDrafts({ cid: forwardToCid, draft: newDraft }));
  };

  const closeModal = useCallback(
    () => removeAndNavigateLastSection(pathname + hash),
    [pathname, hash]
  );

  return (
    <m.div
      className="absolute top-[0px] w-dvw h-dvh bg-(--color-black-50) flex items-center justify-center z-10"
      initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      transition={{ duration: 0.2 }}
    >
      <m.div
        className={`p-[30px] flex flex-col gap-[20px] rounded-[32px] bg-(--color-bg-light) w-[min(460px,100%)] max-md:w-[94svw] max-md:p-[20px] h-[80svh]`}
        key={"forwardTo"}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { delay: 0.1 } }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center">
          <p className="!text-h5 !font-normal text-black">{title}</p>
          <Close
            className="w-[22px] h-[22px] cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <SearchInput
          customClassName="w-full"
          shadowText={"Search"}
          setState={setInputText}
        />
        <SearchBlock
          customClassName="w-full md:max-xl:!w-[400px] max-xl:px-[2svw] max-xl:pt-[2swh] max-xl:pb-[2px]"
          searchText={inputText}
          isClearInputText={true}
          isShowDefaultConvs={true}
          isHideDeletedUsers={true}
          additionalOnClickfunc={onClickFunc}
          clearInputText={() => setInputText(null)}
        />
      </m.div>
    </m.div>
  );
}
