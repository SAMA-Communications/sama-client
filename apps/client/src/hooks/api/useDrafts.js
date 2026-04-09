import { useMemo } from "react";

import {
  clearDraftLocal,
  consumePreEditComposeText,
  flushDraftToLocalStorage,
  getDraft,
  getDraftEditedMessageId,
  getDraftField,
  getDraftMessage,
  getDraftRepliedMessageId,
  getLastInputText,
  purgeDraft,
  pushLocalDraftToReduxNow,
  removeDraftFields,
  saveDraft,
  saveLastInputText,
  savePreEditComposeText,
} from "@lib/draftsEngine.js";

import store from "@store/store.js";

export default function useDrafts() {
  return useMemo(
    () => ({
      syncDraftByCid: () => {},

      saveDraft,

      flushDraftToLocalStorage,

      removeDraft: clearDraftLocal,

      removeDraftWithOptions: (cid, fields, opts) =>
        removeDraftFields(cid, fields, { syncReduxNow: opts?.syncReduxNow ?? false }),

      purgeDraft,
      pushLocalDraftToReduxNow,

      savePreEditComposeText,
      consumePreEditComposeText,

      getDraft,
      getDraftField,
      getDraftMessage,
      getDraftRepliedMessageId,
      getDraftEditedMessageId,

      saveLastInputText,
      getLastInputText,

      getExternalProps: () => store.getState().contextMenu.externalProps,
    }),
    [],
  );
}
