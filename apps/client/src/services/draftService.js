import store from "@store/store.js";
import { updateWithDrafts } from "@store/values/Conversations.js";

class DraftService {
  #getDraftKey(cid) {
    return `draft_${cid}`;
  }

  saveDraft(cid, text) {
    const draftParams = {
      message: text,
      updated_at: Math.floor(Date.now() / 1000),
    };

    const oldDraft = this.getDraftMessage(cid);
    oldDraft !== text &&
      localStorage.setItem(this.#getDraftKey(cid), JSON.stringify(draftParams));
  }

  getDraftMessage(cid) {
    const stringDraftParams = localStorage.getItem(this.#getDraftKey(cid));
    const draftParams = stringDraftParams ? JSON.parse(stringDraftParams) : {};
    return draftParams.message;
  }

  getDraft(cid) {
    const stringDraftParams = localStorage.getItem(this.#getDraftKey(cid));
    const draftParams = stringDraftParams ? JSON.parse(stringDraftParams) : {};
    return draftParams;
  }

  removeDraft(cid) {
    if (!localStorage.getItem(this.#getDraftKey(cid))) return;
    localStorage.removeItem(this.#getDraftKey(cid));
    store.dispatch(updateWithDrafts({ cid, isRemove: true }));
  }
}

const draftService = new DraftService();

export default draftService;
