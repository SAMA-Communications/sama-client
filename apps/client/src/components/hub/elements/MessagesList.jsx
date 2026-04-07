import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useLocation } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import api from "@api/api";

import ChatMessage from "@components/hub/elements/ChatMessage";

import { InformativeMessage } from "@sama-communications.ui-kit";
import { CustomVerticalScrollbar } from "@sama-communications.ui-kit";
import { InteractiveDate } from "@sama-communications.ui-kit";
import { useViewportBreakpoints } from "@sama-communications.ui-kit";

import messagesService from "@services/messagesService.js";

import store from "@store/store.js";
import { getConverastionById } from "@store/values/Conversations";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectActiveConversationMessagesEntities } from "@store/values/Messages";
import { addUsers, selectParticipantsEntities } from "@store/values/Participants";

import { usePersistedScroll } from "@hooks/tools/usePersistedScroll.js";
import { scrollChatMessageIntoViewReliable } from "@utils/scrollPersistence";
import { computeMessageChatLayouts } from "@utils/MessageUtils";
import { upsertMidsInPath } from "@utils/NavigationUtils.js";
import { addSuffix } from "@utils/NavigationUtils.js";

export default function MessagesList({ scrollRef: scrollableContainer }) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const { isMobile } = useViewportBreakpoints();

  const [isScrolling, setIsScrolling] = useState(true);
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(false);
  const isSelectionMode = hash.includes("/selection");

  const participants = useSelector(selectParticipantsEntities);
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const messagesEntites = useSelector(selectActiveConversationMessagesEntities);
  const additionalMessages = messagesEntites.not_visible_messages;

  const orderedMessages = useMemo(() => {
    const ids = selectedConversation?.messagesIds;
    if (!ids?.length) return [];
    return ids.map((id) => messagesEntites[id]).filter(Boolean);
  }, [selectedConversation?.messagesIds, messagesEntites]);

  const [messagesFetchFunc, setMessagesFetchFunc] = useState({});
  const [forwardedMids, setForwardedMids] = useState([]);

  const updateParticipantsFromMessages = (messageArray) => {
    messageArray ??= orderedMessages;
    const usersToUpdate = new Set();

    messageArray.forEach((msg) => {
      if (!participants[msg.from]) {
        usersToUpdate.add(msg.from);
      }
      if (msg.x?.user?._id && !participants[msg.x.user._id]) {
        usersToUpdate.add(msg.x.user._id);
      }
    });

    if (usersToUpdate.size) {
      api.getUsersByIds({ ids: [...usersToUpdate] }).then((users) => dispatch(addUsers(users)));
    }
  };

  useEffect(() => updateParticipantsFromMessages(), []);

  useEffect(() => {
    const midsRegex = /mids=\[([^\]]*)\]/;
    const match = hash.match(midsRegex);

    setForwardedMids(
      match && hash.includes("/selection")
        ? match[1]
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
        : [],
    );
  }, [hash]);

  const removeFetchFuncFromMessage = useCallback((message) => {
    setMessagesFetchFunc((prev) => {
      const { [message._id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  function addFetchFuncToMessage(message, timeParam, gt, lt) {
    setMessagesFetchFunc((prev) => ({
      ...prev,
      [message._id]: async () => {
        await fetchOnViewMessage(
          {
            updated_at: {
              [timeParam]: message.created_at,
              ...(lt ? { lt } : {}),
              ...(gt ? { gt } : {}),
            },
          },
          message._id,
        );
        setMessagesFetchFunc((prev2) => {
          const { [message._id]: _, ...rest } = prev2;
          return rest;
        });
      },
    }));
  }

  async function fetchOnViewMessage(options, anchorMid) {
    const timeParam = options.updated_at.gt ? "gt" : "lt";
    const isInsertBefore = timeParam === "lt";
    const newMessages = await messagesService.getMessagesByCid(selectedCID, {
      updated_at: options.updated_at,
    });

    updateParticipantsFromMessages(newMessages);

    const container = scrollableContainer.current;
    if (!container) return;

    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;

    const { messagesIds } = await messagesService.processMessages(newMessages);

    if (newMessages.length) {
      container.scrollTop = prevScrollTop + (container.scrollHeight - prevScrollHeight);
    }

    if (!messagesIds?.length) return;

    const lastMessage = isInsertBefore ? newMessages[newMessages.length - 1] : newMessages[0];
    const lastMessageIndex = messagesIds.indexOf(lastMessage._id);

    const newAnchorMessageId = isInsertBefore ? messagesIds[lastMessageIndex - 1] : messagesIds[lastMessageIndex + 1];
    const messageEntities = store.getState().messages.entities;
    const newAnchorMessage = messageEntities[newAnchorMessageId];

    if (!newAnchorMessage || newMessages.length < +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD) {
      newAnchorMessage && removeFetchFuncFromMessage(newAnchorMessage);
      anchorMid === lastMessage._id && removeFetchFuncFromMessage(lastMessage);
      return;
    }

    let gt;
    let lt;
    isInsertBefore ? (gt = newAnchorMessage.created_at) : (lt = newAnchorMessage.created_at);

    addFetchFuncToMessage(lastMessage, timeParam, gt, lt);
  }

  function syncFetchFuncAfterMerge(message, timeParam, newMessages, newMessagesIds) {
    const isInsertBefore = timeParam === "lt";
    const lastMessageIndex = newMessagesIds.indexOf(message._id);

    const newAnchorMessageId = isInsertBefore
      ? newMessagesIds[lastMessageIndex - 1]
      : newMessagesIds[lastMessageIndex + 1];
    const messageEntities = store.getState().messages.entities;
    const newAnchorMessage = messageEntities[newAnchorMessageId];

    if (!newAnchorMessage || newMessages.length < +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD) {
      newAnchorMessage && removeFetchFuncFromMessage(newAnchorMessage);
      return;
    }

    let gt;
    let lt;
    isInsertBefore ? (gt = newAnchorMessage.created_at) : (lt = newAnchorMessage.created_at);

    addFetchFuncToMessage(message, timeParam, gt, lt);
  }

  async function loadMessagesAroundReply(rMessage) {
    if (!rMessage || !selectedCID) return false;

    const messagesIds = orderedMessages.map((m) => m._id);
    const rIndex = messagesIds.indexOf(rMessage._id);

    let gt;
    let lt;
    if (rIndex > 0) {
      return true;
    }
    gt = orderedMessages[rIndex - 1]?.created_at;
    lt = orderedMessages[rIndex + 1]?.created_at;

    const nextMessages = await messagesService.getMessagesByCid(selectedCID, {
      updated_at: { lt: rMessage.created_at, ...(gt ? { gt } : {}) },
      limit: 10,
    });
    const prevMessages = await messagesService.getMessagesByCid(selectedCID, {
      updated_at: { gt: rMessage.created_at, ...(lt ? { lt } : {}) },
      limit: 10,
    });

    const newMessages = [...prevMessages, rMessage, ...nextMessages];
    updateParticipantsFromMessages(newMessages);
    const { messagesIds: newMessagesIds } = await messagesService.processMessages(newMessages);

    if (!newMessages.length) return false;

    const firstMsg = newMessages[0];
    const lastMsg = newMessages[newMessages.length - 1];
    syncFetchFuncAfterMerge(firstMsg, "gt", newMessages, newMessagesIds);
    syncFetchFuncAfterMerge(lastMsg, "lt", newMessages, newMessagesIds);
    return true;
  }

  const lastMid = orderedMessages.at(-1)?._id;

  const { columnRef, onScroll, scrollToBottom } = usePersistedScroll({
    scope: "thread",
    scrollRef: scrollableContainer,
    conversationId: selectedCID,
    messagesLength: orderedMessages.length,
    lastMessageId: lastMid,
    setIsScrolling,
    setScrollDownVisible: setIsScrollToBottomVisible,
    loadMessagesAroundReply,
  });

  useEffect(() => {
    if (!orderedMessages.length) return;
    const lastMessage = orderedMessages[0];

    setMessagesFetchFunc((prev) => ({
      ...prev,
      [lastMessage._id]: () => {
        fetchOnViewMessage({ updated_at: { lt: lastMessage.created_at } }, lastMessage._id);
        setMessagesFetchFunc((prev2) => {
          const { [lastMessage._id]: _, ...rest } = prev2;
          return rest;
        });
      },
    }));
  }, [orderedMessages, selectedCID]);

  const onReplyClick = async (rMessage) => {
    if (!rMessage) return null;
    setIsScrolling(true);

    const mid = rMessage._id;
    const messagesIds = orderedMessages.map((m) => m._id);
    const rIndex = messagesIds.indexOf(rMessage._id);

    if (rIndex > 0) {
      await scrollChatMessageIntoViewReliable(scrollableContainer?.current, columnRef.current, mid);
      setIsScrolling(false);
      return;
    }

    await loadMessagesAroundReply(rMessage);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await scrollChatMessageIntoViewReliable(scrollableContainer?.current, columnRef.current, mid);
    setIsScrolling(false);
  };

  const selectMessageFunc = (mid) => {
    setForwardedMids((prev) => [...new Set([...prev, mid])]);
    upsertMidsInPath(pathname + hash, [mid], "add");
  };
  const unselectMessageFunc = (mid) => {
    setForwardedMids((prev) => prev.filter((id) => id !== mid));
    upsertMidsInPath(pathname + hash, [mid], "remove");
  };

  const messageChatLayouts = useMemo(() => computeMessageChatLayouts(orderedMessages), [orderedMessages]);

  const messagesView = useMemo(() => {
    return orderedMessages.map((msg, i) => {
      const { _id, old_id, body, from, replied_message_id, x } = msg;

      const key = old_id || _id;

      const repliedMessage = messagesEntites[replied_message_id] || additionalMessages?.[replied_message_id];

      const isNextMessageYours =
        i < orderedMessages.length - 1
          ? orderedMessages[i].from === orderedMessages[i + 1].from && !orderedMessages[i + 1].x?.type
          : false;
      const isSelected = forwardedMids.includes(_id);

      const layout = messageChatLayouts[i];
      const isSameDayAsPrevMessage =
        i > 0
          ? new Date(msg.t * 1000).toDateString() === new Date(orderedMessages[i - 1].t * 1000).toDateString()
          : false;

      return x?.type ? (
        <InformativeMessage
          key={key}
          text={body}
          isNextMessageUsers={isNextMessageYours}
          onClick={() => addSuffix(pathname + hash, `/user?uid=${x?.user?._id}&view=card`)}
        />
      ) : (
        <Fragment key={key}>
          {!isSameDayAsPrevMessage && <InteractiveDate key={key + "_interactive_date"} date={msg.t} />}
          <ChatMessage
            key={key}
            id={key}
            message={msg}
            onViewFunc={isScrolling ? null : messagesFetchFunc[msg._id]}
            onSelectClick={!isSelected && forwardedMids.length < 20 ? selectMessageFunc : null}
            onUnselectClick={isSelected ? unselectMessageFunc : null}
            onReplyClickFunc={() => onReplyClick(repliedMessage)}
            repliedMessage={repliedMessage}
            sender={participants[from]}
            currentUserId={currentUserId}
            isMobile={isMobile}
            isSelected={isSelected}
            isSelectionMode={isSelectionMode}
            isBlockStart={layout.isBlockStart}
            isBlockEnd={layout.isBlockEnd}
            showAuthor={layout.showAuthor}
            showTimestamp={layout.showTimestamp}
          />
        </Fragment>
      );
    });
  }, [isScrolling, orderedMessages, messagesFetchFunc, messageChatLayouts, forwardedMids, hash, pathname]);

  return (
    <CustomVerticalScrollbar
      containerRef={scrollableContainer}
      containerId="chatMessagesScrollable"
      persistScrollPosition={false}
      onScroll={onScroll}
      isScrollToBottomVisible={isScrollToBottomVisible}
      onScrollToBottom={scrollToBottom}
      className="lg:max-w-300"
      contentClassName="h-full"
    >
      <div ref={columnRef} className="flex min-h-full flex-col justify-end">
        <div className="flex flex-col gap-1.75">{messagesView}</div>
      </div>
    </CustomVerticalScrollbar>
  );
}
