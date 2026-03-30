import store from "@store/store.js";
import { updateWithDrafts } from "@store/values/Conversations.js";

const DRAFT_KEY_PREFIX = "draft_";
const LAST_INPUT_PREFIX = "draft_last_input_";
const PRE_EDIT_COMPOSE_PREFIX = "draft_pre_edit_compose_";

function preEditComposeKey(cid) {
  return `${PRE_EDIT_COMPOSE_PREFIX}${cid}`;
}

const LS_DEBOUNCE_MS = 300;
const REDUX_SYNC_DELAY_MS = 800;

const REDUX_LIST_EXCLUDED_KEYS = ["edited_mid", "forwarded_mids", "forwarded_mid"];

const memory = new Map();
const lsTimers = new Map();
const reduxTimers = new Map();

const draftRevisionByCid = new Map();
const draftRevisionSubscribers = new Map();

let didHydrateFromLocalStorage = false;

function bumpDraftRevision(cid) {
  if (!cid) return;
  const next = (draftRevisionByCid.get(cid) ?? 0) + 1;
  draftRevisionByCid.set(cid, next);
  const subs = draftRevisionSubscribers.get(cid);
  if (subs) subs.forEach((cb) => cb());
}

export function getDraftRevisionSnapshot(cid) {
  return draftRevisionByCid.get(cid) ?? 0;
}

export function subscribeDraftRevision(cid, callback) {
  if (!cid) return () => {};
  if (!draftRevisionSubscribers.has(cid)) draftRevisionSubscribers.set(cid, new Set());
  const set = draftRevisionSubscribers.get(cid);
  set.add(callback);
  return () => {
    set.delete(callback);
    if (set.size === 0) draftRevisionSubscribers.delete(cid);
  };
}

function draftKey(cid) {
  return `${DRAFT_KEY_PREFIX}${cid}`;
}

function lastInputKey(cid) {
  return `${LAST_INPUT_PREFIX}${cid}`;
}

function parseStored(cid) {
  const raw = localStorage.getItem(draftKey(cid));
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function normalizeFieldName(field) {
  if (field === "forwarded_mid") return "forwarded_mids";
  return field;
}

function normalizePatch(patch) {
  const p = { ...patch };
  if (p.forwarded_mid != null && p.forwarded_mids == null) {
    p.forwarded_mids = Array.isArray(p.forwarded_mid) ? p.forwarded_mid : [p.forwarded_mid];
    delete p.forwarded_mid;
  }
  return p;
}

export function hasDraftContent(d) {
  if (!d || typeof d !== "object") return false;
  if (d.text != null && String(d.text).trim() !== "") return true;
  if (d.edited_mid) return true;
  if (d.replied_mid) return true;
  if (Array.isArray(d.forwarded_mids) && d.forwarded_mids.length) return true;
  if (d.updated_mid) return true;
  return false;
}

export function hasListRelevantDraftContent(d) {
  if (!d || typeof d !== "object") return false;
  if (d.text != null && String(d.text).trim() !== "") return true;
  if (d.replied_mid) return true;
  if (d.updated_mid) return true;
  return false;
}

/**
 * Strip edit/forward from draft before Redux.
 * While edit/forward UI is active, also drop text + updated_at so list preview and sort are unchanged.
 */
export function sanitizeDraftForReduxList(draft) {
  if (!draft || typeof draft !== "object") return null;
  const hadEditOrForward =
    !!draft.edited_mid ||
    !!(Array.isArray(draft.forwarded_mids) && draft.forwarded_mids.length) ||
    !!draft.forwarded_mid;
  const next = { ...draft };
  for (const k of REDUX_LIST_EXCLUDED_KEYS) delete next[k];
  if (hadEditOrForward) {
    delete next.text;
    delete next.updated_at;
  }
  return hasListRelevantDraftContent(next) ? next : null;
}

function dispatchListDraftToRedux(cid, fullDraftFromLs) {
  const listDraft = sanitizeDraftForReduxList(fullDraftFromLs);
  if (!listDraft) {
    store.dispatch(updateWithDrafts({ cid, isRemove: true }));
  } else {
    store.dispatch(updateWithDrafts({ cid, draft: listDraft }));
  }
}

function getMemoryOrDisk(cid) {
  if (memory.has(cid)) return { ...memory.get(cid) };
  const d = parseStored(cid);
  memory.set(cid, { ...d });
  return { ...d };
}

function mergeDraft(cid, patch) {
  const prev = getMemoryOrDisk(cid);
  const next = {
    ...prev,
    ...normalizePatch(patch),
    updated_at: Math.floor(Date.now() / 1000),
  };
  memory.set(cid, next);
  return next;
}

function cancelLsTimer(cid) {
  const t = lsTimers.get(cid);
  if (t) clearTimeout(t);
  lsTimers.delete(cid);
}

function writeLsNow(cid) {
  // No in-memory pending state for this chat: do not touch localStorage (avoids wiping LS on chat switch).
  if (!memory.has(cid)) return;

  const d = memory.get(cid);
  if (!d || !hasDraftContent(d)) {
    localStorage.removeItem(draftKey(cid));
    memory.delete(cid);
    return;
  }
  localStorage.setItem(draftKey(cid), JSON.stringify(d));
}

function scheduleLsWrite(cid, debounce) {
  cancelLsTimer(cid);
  if (!debounce) {
    writeLsNow(cid);
    return;
  }
  lsTimers.set(
    cid,
    setTimeout(() => {
      writeLsNow(cid);
      lsTimers.delete(cid);
    }, LS_DEBOUNCE_MS),
  );
}

/**
 * Merge draft fields. Text-only updates are debounced to localStorage (300ms).
 * Structural fields (replied_mid, edited_mid, etc.) flush to localStorage immediately.
 */
export function saveDraft(cid, patch = {}) {
  if (!cid) return;
  const keys = Object.keys(patch);
  const nonTextKeys = keys.filter((k) => k !== "text");
  const debounce = keys.length > 0 && nonTextKeys.length === 0;
  const p = normalizePatch(patch);
  mergeDraft(cid, patch);
  scheduleLsWrite(cid, debounce);
  if (["forwarded_mids", "edited_mid", "replied_mid", "forwarded_mid"].some((k) => p[k] != null)) {
    bumpDraftRevision(cid);
  }
}

export function flushDraftToLocalStorage(cid) {
  if (!cid) return;
  cancelLsTimer(cid);
  writeLsNow(cid);
}

export function getDraft(cid) {
  if (!cid) return {};
  return { ...getMemoryOrDisk(cid) };
}

export function getDraftField(cid, field) {
  const f = normalizeFieldName(field);
  return getDraft(cid)[f];
}

export function getDraftMessage(cid) {
  const t = getDraft(cid).text;
  return t == null ? "" : String(t);
}

export function getDraftRepliedMessageId(cid) {
  return getDraftField(cid, "replied_mid");
}

export function getDraftEditedMessageId(cid) {
  return getDraftField(cid, "edited_mid");
}

export function saveLastInputText(cid, text) {
  if (!cid) return;
  localStorage.setItem(lastInputKey(cid), text);
}

export function getLastInputText(cid) {
  if (!cid) return "";
  const key = lastInputKey(cid);
  const v = localStorage.getItem(key);
  localStorage.removeItem(key);
  return v || "";
}

/** Text in the composer before entering edit mode (separate from draft.text while editing). */
export function savePreEditComposeText(cid, text) {
  if (!cid) return;
  localStorage.setItem(preEditComposeKey(cid), text == null ? "" : String(text));
}

export function consumePreEditComposeText(cid) {
  if (!cid) return "";
  const k = preEditComposeKey(cid);
  const v = localStorage.getItem(k) || "";
  localStorage.removeItem(k);
  return v;
}

export function cancelReduxDraftSync(cid) {
  const t = reduxTimers.get(cid);
  if (t) clearTimeout(t);
  reduxTimers.delete(cid);
}

function applyDraftToRedux(cid) {
  const raw = localStorage.getItem(draftKey(cid));
  let draft = {};
  if (raw) {
    try {
      draft = JSON.parse(raw);
    } catch {
      draft = {};
    }
  }
  if (!hasDraftContent(draft)) {
    store.dispatch(updateWithDrafts({ cid, isRemove: true }));
    return;
  }
  dispatchListDraftToRedux(cid, draft);
}

export function pushLocalDraftToReduxNow(cid) {
  if (!cid) return;
  flushDraftToLocalStorage(cid);
  cancelReduxDraftSync(cid);
  applyDraftToRedux(cid);
}

export function scheduleReduxDraftSync(cid) {
  if (!cid) return;
  flushDraftToLocalStorage(cid);
  cancelReduxDraftSync(cid);
  reduxTimers.set(
    cid,
    setTimeout(() => {
      reduxTimers.delete(cid);
      applyDraftToRedux(cid);
    }, REDUX_SYNC_DELAY_MS),
  );
}

/** Full removal from localStorage, memory, and Redux (send, delete chat, forward complete, attach send). */
export function purgeDraft(cid) {
  if (!cid) return;
  cancelLsTimer(cid);
  cancelReduxDraftSync(cid);
  localStorage.removeItem(draftKey(cid));
  localStorage.removeItem(lastInputKey(cid));
  localStorage.removeItem(preEditComposeKey(cid));
  memory.delete(cid);
  bumpDraftRevision(cid);
  store.dispatch(updateWithDrafts({ cid, isRemove: true }));
}

export function clearDraftLocal(cid) {
  if (!cid) return;
  cancelLsTimer(cid);
  cancelReduxDraftSync(cid);
  localStorage.removeItem(draftKey(cid));
  localStorage.removeItem(preEditComposeKey(cid));
  memory.delete(cid);
  bumpDraftRevision(cid);
}

export function removeDraftFields(cid, fields, { syncReduxNow = false } = {}) {
  if (!cid) return;
  const fieldsArray = fields == null ? null : Array.isArray(fields) ? fields : [fields];
  if (!fieldsArray?.length) {
    clearDraftLocal(cid);
    if (syncReduxNow) applyDraftToRedux(cid);
    return;
  }

  flushDraftToLocalStorage(cid);
  let draft = { ...getMemoryOrDisk(cid) };
  let modified = false;
  for (const field of fieldsArray) {
    const f = normalizeFieldName(field);
    if (Object.prototype.hasOwnProperty.call(draft, f)) {
      delete draft[f];
      modified = true;
    }
  }
  if (!modified) return;

  if (!hasDraftContent(draft)) {
    localStorage.removeItem(draftKey(cid));
    memory.delete(cid);
    bumpDraftRevision(cid);
    if (syncReduxNow) {
      store.dispatch(updateWithDrafts({ cid, isRemove: true }));
    }
    return;
  }

  draft = { ...draft, updated_at: Math.floor(Date.now() / 1000) };
  memory.set(cid, draft);
  writeLsNow(cid);
  bumpDraftRevision(cid);

  if (syncReduxNow) {
    cancelReduxDraftSync(cid);
    dispatchListDraftToRedux(cid, draft);
  }
}

/** Adapter alias: deferred Redux (default). */
export function removeDraftWithOptions(cid, fields, options) {
  removeDraftFields(cid, fields, { syncReduxNow: options?.syncReduxNow ?? false });
}

/**
 * Once per app load: merge persisted drafts into Redux for list ordering / previews.
 */
export function hydrateDraftsFromLocalStorage() {
  if (didHydrateFromLocalStorage || typeof localStorage === "undefined") return;
  const conversations = store.getState().conversations?.entities;
  if (!conversations) return;

  didHydrateFromLocalStorage = true;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith(DRAFT_KEY_PREFIX)) continue;
    const cid = k.slice(DRAFT_KEY_PREFIX.length);
    if (!conversations[cid]) continue;
    try {
      const draft = JSON.parse(localStorage.getItem(k) || "{}");
      if (!hasDraftContent(draft)) continue;
      const listDraft = sanitizeDraftForReduxList(draft);
      listDraft && store.dispatch(updateWithDrafts({ cid, draft: listDraft }));
    } catch {}
  }
}
