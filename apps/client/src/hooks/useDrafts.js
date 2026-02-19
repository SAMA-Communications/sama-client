import draftService from "@services/tools/draftService.js";

import store from "@store/store.js";
import { updateWithDrafts } from "@store/values/Conversations.js";

export default function useDrafts() {
  const _allowedDraftFields = ["text", "replied_mid", "edited_mid"];

  const _getDraftKey = (cid) => `draft_${cid}`;

  const _getLastInputDraftKey = (cid) => `draft_last_input_${cid}`;

  const syncDraftByCid = (cid, oldDraft, convUpdatedAt) => {
    const draftParams = draftService.getDraft(cid);

    const { text, replied_mid, updated_at: draftUpdatedAt } = draftParams;
    if (!text && !replied_mid) return;
    if (!oldDraft) {
      store.dispatch(updateWithDrafts({ cid, draft: draftParams }));
      return;
    }

    const convUpdatedAtConverted = Math.floor(Date.parse(convUpdatedAt) / 1000);
    !(draftUpdatedAt === convUpdatedAtConverted) && store.dispatch(updateWithDrafts({ cid, draft: draftParams }));
    //|| draftUpdatedAt === last_message?.t
  };

  const saveDraft = (cid, options) => {
    const draftParams = { updated_at: Math.floor(Date.now() / 1000) };
    options.text && (draftParams.text = options.text);
    options.replied_mid && (draftParams.replied_mid = options.replied_mid);
    options.edited_mid && (draftParams.edited_mid = options.edited_mid);

    const oldDraft = getDraft(cid);
    const newDraft = { ...oldDraft, ...draftParams };
    localStorage.setItem(_getDraftKey(cid), JSON.stringify(newDraft));
  };

  const removeDraft = (cid) => {
    const draftKey = _getDraftKey(cid);
    localStorage.removeItem(draftKey);
    store.dispatch(updateWithDrafts({ cid, isRemove: true }));
  };

  const removeDraftWithOptions = (cid, fields) => {
    const draftKey = _getDraftKey(cid);
    const draft = getDraft(cid);

    if (!localStorage.getItem(draftKey)) return;
    if (!fields) return removeDraft(cid);

    const fieldsArray = Array.isArray(fields) ? fields : [fields];

    let modified = false;

    for (const field of fieldsArray) {
      if (_allowedDraftFields.includes(field) && draft.hasOwnProperty(field)) {
        delete draft[field];
        modified = true;
      }
    }

    if (!modified) return;

    if (Object.keys(draft).length <= 1) {
      removeDraft(cid);
    } else {
      localStorage.setItem(draftKey, JSON.stringify(draft));
      store.dispatch(updateWithDrafts({ cid, draft }));
    }
  };

  const getDraft = (cid) => {
    const stringDraftParams = localStorage.getItem(_getDraftKey(cid));
    const draftParams = stringDraftParams ? JSON.parse(stringDraftParams) : {};
    return draftParams;
  };

  const getDraftMessage = (cid) => {
    return getDraft(cid).text;
  };

  const saveLastInputText = (cid, text) => {
    const draftKey = _getLastInputDraftKey(cid);
    localStorage.setItem(draftKey, text);
  };

  const getLastInputText = (cid) => {
    const draftKey = _getLastInputDraftKey(cid);
    const lastInputText = localStorage.getItem(draftKey);
    localStorage.removeItem(draftKey);
    return lastInputText;
  };

  const getExternalProps = () => {
    return store.getState().contextMenu.externalProps;
  };

  return {
    syncDraftByCid,
    saveDraft,
    removeDraftWithOptions,
    getDraftMessage,
    getExternalProps,
    saveLastInputText,
    getLastInputText,
  };
}
