import draftService from "@services/tools/draftService.js";

import store from "@store/store.js";
import { updateWithDrafts } from "@store/values/Conversations.js";

export default function useDrafts() {
  const syncDraftByCid = (cid, oldDraft, convUpdatedAt) => {
    const draftParams = draftService.getDraft(cid);
    const { text, replied_mid, updated_at: draftUpdatedAt } = draftParams;
    if (!text && !replied_mid) return;
    if (!oldDraft) {
      store.dispatch(updateWithDrafts({ cid, draft: draftParams }));
      return;
    }

    const convUpdatedAtConverted = Math.floor(Date.parse(convUpdatedAt) / 1000);
    !(
      draftUpdatedAt === convUpdatedAtConverted ||
      draftUpdatedAt === last_message?.t
    ) && store.dispatch(updateWithDrafts({ cid, draft: draftParams }));
  };

  return { syncDraftByCid };
}
