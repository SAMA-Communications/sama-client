import { useListPersistedScroll } from "./persistedScroll/list.js";
import { useThreadPersistedScroll } from "./persistedScroll/thread.js";

/** @typedef {'list' | 'thread'} PersistedScrollScope */

/**
 * Scroll persistence for the chat list (`list`) or message thread (`thread`).
 * Both branches mount internally (rules of hooks); only the matching scope runs logic.
 *
 * List: `listScrollRef`, `listInnerRef`, `searchActive`, `filteredConversations`, `conversationCount`, `fetchConversations`, `storeNewConversations` → `{ onPersist }`
 *
 * Thread: `scrollRef`, `conversationId`, `messagesLength`, `lastMessageId`, `setIsScrolling`, `setScrollDownVisible`, `loadMessagesAroundReply` → `{ columnRef, onScroll, scrollToBottom }`
 */
export function usePersistedScroll(config) {
  const isList = config.scope === "list";
  const isThread = config.scope === "thread";

  const listProps = isList
    ? {
        listScrollRef: config.listScrollRef,
        listInnerRef: config.listInnerRef,
        searchActive: config.searchActive,
        filteredConversations: config.filteredConversations,
        conversationCount: config.conversationCount,
        fetchConversations: config.fetchConversations,
        storeNewConversations: config.storeNewConversations,
      }
    : null;

  const threadProps = isThread
    ? {
        scrollRef: config.scrollRef,
        conversationId: config.conversationId,
        messagesLength: config.messagesLength,
        lastMessageId: config.lastMessageId,
        setIsScrolling: config.setIsScrolling,
        setScrollDownVisible: config.setScrollDownVisible,
        loadMessagesAroundReply: config.loadMessagesAroundReply,
      }
    : null;

  const { onPersist } = useListPersistedScroll(isList, listProps);
  const { columnRef, onScroll, scrollToBottom } = useThreadPersistedScroll(isThread, threadProps);

  if (isList) return { onPersist };
  return { columnRef, onScroll, scrollToBottom };
}
