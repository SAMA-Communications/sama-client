import store from "@store/store.js";
import { updateWithDrafts } from "@store/values/Conversations.js";

class DraftService {
  #allowedDraftFields = ["text", "replied_mid", "edited_mid"];

  #getDraftKey(cid) {
    return `draft_${cid}`;
  }

  #getLastInputDraftKey(cid) {
    return `draft_last_input_${cid}`;
  }

  saveDraft(cid, options) {
    const draftParams = { updated_at: Math.floor(Date.now() / 1000) };
    options.text && (draftParams.text = options.text);
    options.replied_mid && (draftParams.replied_mid = options.replied_mid);
    options.edited_mid && (draftParams.edited_mid = options.edited_mid);

    const oldDraft = this.getDraft(cid);
    const newDraft = { ...oldDraft, ...draftParams };
    localStorage.setItem(this.#getDraftKey(cid), JSON.stringify(newDraft));
  }

  getDraft(cid) {
    const stringDraftParams = localStorage.getItem(this.#getDraftKey(cid));
    const draftParams = stringDraftParams ? JSON.parse(stringDraftParams) : {};
    return draftParams;
  }

  getDraftMessage(cid) {
    return this.getDraft(cid).text;
  }

  getDraftRepliedMessageId(cid) {
    return this.getDraft(cid).replied_mid;
  }

  getDraftEditedMessageId(cid) {
    return this.getDraft(cid).edited_mid;
  }

  removeDraft(cid) {
    const draftKey = this.#getDraftKey(cid);
    localStorage.removeItem(draftKey);
    store.dispatch(updateWithDrafts({ cid, isRemove: true }));
  }

  removeDraftWithOptions(cid, fields) {
    const draftKey = this.#getDraftKey(cid);
    const draft = this.getDraft(cid);

    if (!localStorage.getItem(draftKey)) return;
    if (!fields) return this.removeDraft(cid);

    const fieldsArray = Array.isArray(fields) ? fields : [fields];

    let modified = false;
    for (const field of fieldsArray) {
      if (
        this.#allowedDraftFields.includes(field) &&
        draft.hasOwnProperty(field)
      ) {
        delete draft[field];
        modified = true;
      }
    }

    if (!modified) return;

    if (Object.keys(draft).length <= 1) {
      this.removeDraft(cid);
    } else {
      localStorage.setItem(draftKey, JSON.stringify(draft));
      store.dispatch(updateWithDrafts({ cid, draft }));
    }
  }

  saveLastInputText(cid, text) {
    const draftKey = this.#getLastInputDraftKey(cid);
    localStorage.setItem(draftKey, text);
  }

  getLastInputText(cid) {
    const draftKey = this.#getLastInputDraftKey(cid);
    const lastInputText = localStorage.getItem(draftKey);
    localStorage.removeItem(draftKey);
    return lastInputText;
  }
}

const draftService = new DraftService();

export default draftService;
