import { domMax, LayoutGroup, LazyMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import api from "@api/api";

import DownloadManager from "@lib/downloadManager";

import InformativeMessage from "@components/hub/elements/InformativeMessage";
import ChatMessage from "@components/hub/elements/ChatMessage";

import {
  addMessages,
  upsertMessages,
  selectActiveConversationMessagesEntities,
} from "@store/values/Messages";
import {
  addUsers,
  selectParticipantsEntities,
} from "@store/values/Participants";
import { getConverastionById, upsertChat } from "@store/values/Conversations";
import { selectCurrentUserId } from "@store/values/CurrentUserId";

export default function MessagesList() {
  const dispatch = useDispatch();
  const location = useLocation();

  const scrollableContainer = useRef(null);

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
    const scrollToBottom = () => {
      scrollableContainer.current.scrollTop =
        scrollableContainer.current.scrollHeight;
    };
    scrollToBottom();
  }, [location, scrollableContainer]);

  // const needToGetMoreMessage = useRef(true);
  const lastMessageRef = useCallback(async () => {
    if (!selectedCID || messages.length === 0) return;

    const arr = await api.messageList({
      cid: selectedCID,
      limit: +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD,
      updated_at: { lt: messages[0].created_at },
    });
    if (!arr.length) {
      // needToGetMoreMessage.current = false;
      return;
    }

    const messagesIds = arr.map((el) => el._id).reverse();
    // needToGetMoreMessage.current = !(
    //   messagesIds.length < +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD
    // );

    updateParticipantsFromMessages(arr);
    dispatch(addMessages(arr));
    dispatch(
      upsertChat({
        _id: selectedCID,
        messagesIds: [
          ...new Set([...messagesIds, ...messages.map((el) => el._id)]),
        ],
        activated: true,
      })
    );

    const mAttachments = {};
    const repliedMids = [];

    const handleAttachments = (mid, attachments) => {
      attachments.forEach((obj) => {
        const mAttachmentsObject = mAttachments[obj.file_id];
        if (!mAttachmentsObject) {
          mAttachments[obj.file_id] = { _id: mid, ...obj };
          return;
        }

        const mids = mAttachmentsObject._id;
        mAttachments[obj.file_id]._id = Array.isArray(mids)
          ? [mid, ...mids]
          : [mid, mids];
      });
    };

    for (let i = 0; i < arr.length; i++) {
      const { _id, attachments, replied_message_id } = arr[i];
      attachments && handleAttachments(_id, attachments);
      replied_message_id && repliedMids.push(replied_message_id);
    }

    if (repliedMids.length) {
      const repliedMsgs = await api.messageList({
        cid: selectedCID,
        ids: repliedMids,
      });
      const receivedIds = new Set(
        repliedMsgs.map((msg) => {
          msg.attachments && handleAttachments(msg._id, msg.attachments);
          return msg._id;
        })
      );
      repliedMsgs.length && dispatch(addMessages(repliedMsgs));

      const notReceived = repliedMids.filter((mid) => !receivedIds.has(mid));
      notReceived.length &&
        dispatch(
          addMessages(
            notReceived.map((_id) => ({ _id, error: "Message deleted" }))
          )
        );
    }

    if (Object.keys(mAttachments).length > 0) {
      DownloadManager.getDownloadFileLinks(mAttachments).then((msgs) => {
        const messagesToUpdate = msgs.flatMap((msg) => {
          const mids = Array.isArray(msg._id) ? msg._id : [msg._id];
          return mids.map((mid) => ({ ...msg, _id: mid }));
        });

        dispatch(upsertMessages(messagesToUpdate));
      });
    }
  }, [selectedCID, messages]);

  const messagesView = useMemo(() => {
    return messages.map((msg, i) => {
      const { _id, old_id, body, from, replied_message_id, x } = msg;

      const key = old_id || _id;
      const repliedMessage =
        messagesEntites[replied_message_id] ||
        additionalMessages[replied_message_id];

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
          onViewFunc={i === 0 ? lastMessageRef : null}
          repliedMessage={repliedMessage}
          sender={participants[from]}
          currentUserId={currentUserId}
          isPrevMesssageYours={isPrevMesssageYours}
          isNextMessageYours={isNextMessageYours}
        />
      );
    });
  }, [messagesEntites, scrollableContainer]);

  return (
    <div
      className="flex flex-col flex-grow justify-end overflow-auto"
      id="chatMessagesScrollable"
      ref={scrollableContainer}
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
