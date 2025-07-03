import { domMax, LayoutGroup, LazyMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import api from "@api/api";

import messagesService from "@services/messagesService.js";

import InformativeMessage from "@components/hub/elements/InformativeMessage";
import ChatMessage from "@components/hub/elements/ChatMessage";

import { selectActiveConversationMessagesEntities } from "@store/values/Messages";
import {
  addUsers,
  selectParticipantsEntities,
} from "@store/values/Participants";
import { getConverastionById } from "@store/values/Conversations";
import { selectCurrentUserId } from "@store/values/CurrentUserId";

let timer = null;

export default function MessagesList() {
  const dispatch = useDispatch();
  const location = useLocation();

  const scrollableContainer = useRef(null);
  const [isScrolling, setIsScrolling] = useState(true);

  const participants = useSelector(selectParticipantsEntities);
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const messagesEntites = useSelector(selectActiveConversationMessagesEntities);
  const additionalMessages = messagesEntites.not_visible_messages;
  const messages = useMemo(
    () =>
      Object.entries(messagesEntites)
        .filter(([key]) => key !== "not_visible_messages")
        .map(([, value]) => value),
    [messagesEntites]
  );
  const [messagesFetchFunc, setMessagesFetchFunc] = useState({});

  const updateParticipantsFromMessages = (messageArray) => {
    messageArray ??= messages;
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
      api
        .getUsersByIds({ ids: [...usersToUpdate] })
        .then((users) => dispatch(addUsers(users)));
    }
  };

  useEffect(() => updateParticipantsFromMessages(), []);

  useEffect(() => {
    if (!scrollableContainer.current) return;
    const container = scrollableContainer.current;
    const savedScrollFromBottom = localStorage.getItem(
      `scroll_pos_${selectedCID}`
    );

    const restoreScrollPosition = () => {
      if (savedScrollFromBottom !== null) {
        container.scrollTop =
          container.scrollHeight -
          container.clientHeight -
          Number(savedScrollFromBottom);
      } else {
        container.scrollTop = container.scrollHeight;
      }
      setIsScrolling(false);
    };

    setTimeout(restoreScrollPosition, 100);
  }, [location]);

  const fetchOnViewMessage = async (options, anchorMid) => {
    const timeParam = options.updated_at.gt ? "gt" : "lt";
    const isInsertBefore = timeParam === "lt";
    const newMessages = await messagesService.getMessagesByCid(selectedCID, {
      updated_at: options.updated_at,
    });

    updateParticipantsFromMessages(newMessages);

    const container = scrollableContainer.current;
    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;

    const { messagesIds } = await messagesService.processMessages(newMessages, {
      anchor_mid: anchorMid,
      position: timeParam,
    });

    if (newMessages.length) {
      container.scrollTop =
        prevScrollTop + (container.scrollHeight - prevScrollHeight);
    }

    if (!messagesIds?.length) return;

    const lastMessage = isInsertBefore
      ? newMessages[newMessages.length - 1]
      : newMessages[0];
    const lastMessageIndex = messagesIds.indexOf(lastMessage._id);

    const newAnchorMessageId = isInsertBefore
      ? messagesIds[lastMessageIndex - 1]
      : messagesIds[lastMessageIndex + 1];
    const newAnchorMessage = messagesEntites[newAnchorMessageId];

    if (
      !newAnchorMessage ||
      newMessages.length < +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD
    ) {
      newAnchorMessage && removeFetchFuncFromMessage(newAnchorMessage);
      return;
    }

    let gt, lt;
    isInsertBefore
      ? (gt = newAnchorMessage.created_at)
      : (lt = newAnchorMessage.created_at);

    addFetchFuncToMessage(lastMessage, timeParam, gt, lt);
  };

  useEffect(() => {
    if (!messages.length) return;
    const lastMessage = messages[0];
    setMessagesFetchFunc((prev) => ({
      ...prev,
      [lastMessage._id]: () => {
        fetchOnViewMessage({ updated_at: { lt: lastMessage.created_at } });
        setMessagesFetchFunc((prev2) => {
          const { [lastMessage._id]: _, ...rest } = prev2;
          return rest;
        });
      },
    }));
  }, [messages]);

  const removeFetchFuncFromMessage = (message) => {
    setMessagesFetchFunc((prev) => {
      const { [message._id]: _, ...rest } = prev;
      return rest;
    });
  };

  const addFetchFuncToMessage = (message, timeParam, gt, lt) => {
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
          message._id
        );
        setMessagesFetchFunc((prev2) => {
          const { [message._id]: _, ...rest } = prev2;
          return rest;
        });
      },
    }));
  };

  const onReplyClick = async (rMessage) => {
    if (!rMessage) return null;
    setIsScrolling(true);

    const messagesIds = messages.map((m) => m._id);
    const rIndex = messagesIds.indexOf(rMessage._id);

    const scrollToMessage = (message) => {
      const container = scrollableContainer.current;
      if (container) {
        const messageElement = container.querySelector(
          `[data-message-id="${message._id}"]`
        );
        if (messageElement) {
          messageElement.scrollIntoView({ block: "center" });
          setIsScrolling(false);
        }
      }
    };

    let gt, lt;
    if (rIndex > 0) {
      scrollToMessage(rMessage);
      return;
    } else {
      gt = messages[rIndex - 1]?.created_at;
      lt = messages[rIndex + 1]?.created_at;
    }

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
    const { messagesIds: newMessagesIds } =
      await messagesService.processMessages(newMessages, {});

    if (newMessages.length) {
      const syncFetchFunc = (
        message,
        timeParam,
        newMessages,
        newMessagesIds
      ) => {
        const isInsertBefore = timeParam === "lt";
        const lastMessageIndex = newMessagesIds.indexOf(message._id);

        const newAnchorMessageId = isInsertBefore
          ? newMessagesIds[lastMessageIndex - 1]
          : newMessagesIds[lastMessageIndex + 1];
        const newAnchorMessage = messagesEntites[newAnchorMessageId];

        if (
          !newAnchorMessage ||
          newMessages.length < +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD
        ) {
          newAnchorMessage && removeFetchFuncFromMessage(newAnchorMessage);
          return;
        }

        let gt, lt;
        isInsertBefore
          ? (gt = newAnchorMessage.created_at)
          : (lt = newAnchorMessage.created_at);

        addFetchFuncToMessage(message, timeParam, gt, lt);
      };

      const firstMsg = newMessages[0];
      const lastMsg = newMessages[newMessages.length - 1];

      syncFetchFunc(firstMsg, "gt", newMessages, newMessagesIds);
      syncFetchFunc(lastMsg, "lt", newMessages, newMessagesIds);

      setTimeout(() => scrollToMessage(rMessage), 100);
    }
  };

  const messagesView = useMemo(() => {
    return messages.map((msg, i) => {
      const { _id, old_id, body, from, replied_message_id, x } = msg;

      const key = old_id || _id;

      const repliedMessage =
        messagesEntites[replied_message_id] ||
        additionalMessages?.[replied_message_id];

      const isPrevMesssageUsers = i > 0 ? !messages[i - 1].x?.type : false;
      const isPrevMesssageYours =
        i > 0
          ? messages[i - 1].from === messages[i].from &&
            !messages[i - 1].x?.type
          : false;
      const isNextMessageYours =
        i < messages.length - 1
          ? messages[i].from === messages[i + 1].from &&
            !messages[i + 1].x?.type
          : false;

      return x?.type ? (
        <InformativeMessage
          key={key}
          id={key}
          params={x}
          text={body}
          isPrevMesssageUsers={isPrevMesssageUsers}
        />
      ) : (
        <ChatMessage
          key={key}
          id={key}
          message={msg}
          onViewFunc={isScrolling ? null : messagesFetchFunc[msg._id]}
          onReplyClickFunc={() => onReplyClick(repliedMessage)}
          repliedMessage={repliedMessage}
          sender={participants[from]}
          currentUserId={currentUserId}
          isPrevMesssageYours={isPrevMesssageYours}
          isNextMessageYours={isNextMessageYours}
        />
      );
    });
  }, [isScrolling, messages, messagesFetchFunc]);

  return (
    <div
      className="flex flex-col flex-grow justify-end overflow-auto"
      id="chatMessagesScrollable"
      ref={scrollableContainer}
      onScroll={() => {
        if (timer !== null) clearTimeout(timer);
        timer = setTimeout(() => {
          const container = scrollableContainer.current;
          const scrollFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;
          localStorage.setItem(`scroll_pos_${selectedCID}`, scrollFromBottom);
        }, 150);
      }}
    >
      <div className="h-full py-[15px] flex flex-col gap-[7px]">
        <LazyMotion features={domMax}>
          <LayoutGroup id="chatMessagesListLayoutGroup">
            {messagesView}
          </LayoutGroup>
        </LazyMotion>
      </div>
    </div>
  );
}
