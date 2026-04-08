import conversationService from "@services/conversationsService";
import { setSelectedConversation } from "@store/values/SelectedConversation";

export const ensureSelectedConversationMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);

  if (!setSelectedConversation.match(action)) return result;

  const cid = action.payload?.id ?? action.payload?.cid;
  if (!cid || typeof cid !== "string") return result;

  const state = storeApi.getState();
  if (!state.userIsLoggedIn?.value) return result;
  if (state.conversations.entities?.[cid]?._id) return result;

  queueMicrotask(() => {
    void conversationService.ensureConversationInStoreIfMissing(cid);
  });

  return result;
};
