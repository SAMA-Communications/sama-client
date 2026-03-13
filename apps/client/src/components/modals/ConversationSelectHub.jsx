import { useCallback, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { ConversationSelectModal } from "@sama-communications.ui-kit";

import { SearchInput } from "@sama-communications.ui-kit";
import SearchBlock from "@components/search/SearchBlock";

import { selectConversationsEntities, updateWithDrafts } from "@store/values/Conversations.js";

import { extractForwardedMids } from "@utils/ConversationUtils.js";
import { removeAndNavigateLastSection } from "@utils/NavigationUtils.js";

export default function ConversationSelectHub({ title }) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();
  const [inputText, setInputText] = useState(null);
  const conversations = useSelector(selectConversationsEntities);

  const onClickFunc = useCallback(
    (forwardToCid) => {
      const forwardedMids = extractForwardedMids(hash);
      if (!forwardedMids.length) return;

      const forwardToConversation = conversations[forwardToCid];
      const newDraft = {
        ...(forwardToConversation?.draft || {}),
        forwarded_mids: forwardedMids,
      };
      dispatch(updateWithDrafts({ cid: forwardToCid, draft: newDraft }));
    },
    [hash, conversations, dispatch]
  );

  const closeModal = useCallback(
    () => removeAndNavigateLastSection(pathname + hash),
    [pathname, hash]
  );

  return (
    <ConversationSelectModal title={title} onClose={closeModal}>
      <SearchInput
        customClassName="w-full"
        placeholder="Search"
        setState={setInputText}
      />
      <SearchBlock
        customClassName="w-full md:max-xl:!w-[400px] max-xl:px-[2svw] max-xl:pt-[2swh] max-xl:pb-[2px]"
        searchText={inputText}
        isClearInputText
        isShowDefaultConvs
        isHideDeletedUsers
        additionalOnClickfunc={onClickFunc}
        clearInputText={() => setInputText(null)}
      />
    </ConversationSelectModal>
  );
}
