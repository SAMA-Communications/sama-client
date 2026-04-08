import { useCallback, useState } from "react";

import { useLocation } from "react-router";

import SearchBlock from "@components/search/SearchBlock";

import { saveDraft } from "@lib/draftsEngine.js";

import { ConversationSelectModal } from "@sama-communications.ui-kit";
import { SearchInput } from "@sama-communications.ui-kit";

import { extractForwardedMids } from "@utils/ConversationUtils.js";
import { navigateTo, removeAndNavigateLastSection } from "@utils/NavigationUtils.js";
import messagesService from "@services/messagesService";

export default function ConversationSelectHub({ title }) {
  const { pathname, hash } = useLocation();
  const [inputText, setInputText] = useState(null);

  const onClickFunc = useCallback(
    (forwardToCid) => {
      const forwardedMids = extractForwardedMids(hash);
      if (!forwardedMids.length) return;

      saveDraft(forwardToCid, {
        forwarded_mids: forwardedMids,
        forwarded_snapshots: messagesService.buildForwardedSnapshots(forwardedMids),
      });
      navigateTo(`/#${forwardToCid}`);
    },
    [hash],
  );

  const closeModal = useCallback(() => removeAndNavigateLastSection(pathname + hash), [pathname, hash]);

  return (
    <ConversationSelectModal
      title={title}
      onClose={closeModal}
      topContent={
        <SearchInput
          customClassName="w-full"
          placeholder="Search"
          value={inputText ?? ""}
          onChange={(v) => setInputText(v || null)}
        />
      }
    >
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
