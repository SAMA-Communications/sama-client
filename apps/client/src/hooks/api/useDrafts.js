import draftService from "@services/tools/draftService.js";
import store from "@store/store.js";

export default function useDrafts() {
  const syncDraftByCid = (cid, _oldDraft, _convUpdatedAt) => {
    draftService.flushDraftSyncToStore(cid);
  };

  const saveDraft = (cid, options, meta) => {
    draftService.saveDraft(cid, options, meta);
  };

  const removeDraft = (cid) => {
    draftService.removeDraft(cid);
  };

  const removeDraftWithOptions = (cid, fields) => {
    draftService.removeDraftWithOptions(cid, fields);
  };

  const getDraft = (cid) => draftService.getDraft(cid);

  const getDraftMessage = (cid) => draftService.getDraftMessage(cid);

  const saveLastInputText = (cid, text) => {
    draftService.saveLastInputText(cid, text);
  };

  const getLastInputText = (cid) => draftService.getLastInputText(cid);

  const getExternalProps = () => {
    return store.getState().contextMenu.externalProps;
  };

  return {
    syncDraftByCid,
    saveDraft,
    removeDraft,
    removeDraftWithOptions,
    getDraft,
    getDraftMessage,
    getExternalProps,
    saveLastInputText,
    getLastInputText,
  };
}
