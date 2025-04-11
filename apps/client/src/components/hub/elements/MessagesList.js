import ChatMessage from "@components/hub/elements/ChatMessage";
import DownloadManager from "@lib/downloadManager";
import InfiniteScroll from "react-infinite-scroll-component";
import InformativeMessage from "@components/hub/elements/InformativeMessage";
import api from "@api/api";
import {
  addMessages,
  selectActiveConversationMessages,
  upsertMessages,
} from "@store/values/Messages";
import {
  addUsers,
  selectParticipantsEntities,
} from "@store/values/Participants";
import { getConverastionById, upsertChat } from "@store/values/Conversations";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function MessagesList({ scrollRef }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const messages = useSelector(selectActiveConversationMessages);
  const participants = useSelector(selectParticipantsEntities);
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

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

  const needToGetMoreMessage = useRef(true);
  const lastMessageRef = useCallback(() => {
    if (!selectedCID || messages.length === 0) return;
    api
      .messageList({
        cid: selectedCID,
        limit: +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD,
        updated_at: { lt: messages[0].created_at },
      })
      .then((arr) => {
        if (!arr.length) {
          needToGetMoreMessage.current = false;
          return;
        }

        const messagesIds = arr.map((el) => el._id).reverse();
        needToGetMoreMessage.current = !(
          messagesIds.length < +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD
        );

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
        for (let i = 0; i < arr.length; i++) {
          const attachments = arr[i].attachments;
          if (!attachments) {
            continue;
          }
          attachments.forEach((obj) => {
            const mAttachmentsObject = mAttachments[obj.file_id];
            if (!mAttachmentsObject) {
              mAttachments[obj.file_id] = {
                _id: arr[i]._id,
                ...obj,
              };
              return;
            }

            const mids = mAttachmentsObject._id;
            mAttachments[obj.file_id]._id = Array.isArray(mids)
              ? [arr[i]._id, ...mids]
              : [arr[i]._id, mids];
          });
        }

        if (Object.keys(mAttachments).length > 0) {
          DownloadManager.getDownloadFileLinks(mAttachments).then((msgs) =>
            dispatch(upsertMessages(msgs))
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
      });
  }, [selectedCID, messages, needToGetMoreMessage]);

  useLayoutEffect(() => {
    setTimeout(() => (needToGetMoreMessage.current = true), 300);
  }, [location]);

  return (
    <InfiniteScroll
      ref={scrollRef}
      dataLength={messages.length}
      next={lastMessageRef}
      inverse={true}
      hasMore={true && needToGetMoreMessage.current}
      scrollableTarget="chatMessagesScrollable"
    >
      {messages.map((msg, i) =>
        msg.x?.type ? (
          <InformativeMessage
            key={msg._id}
            params={msg.x}
            text={msg.body}
            isPrevMesssageUsers={i > 0 ? !messages[i - 1].x?.type : false}
          />
        ) : (
          <ChatMessage
            key={msg._id}
            message={msg}
            sender={participants[msg.from]}
            currentUserId={currentUserId}
            isPrevMesssageYours={
              i > 0
                ? messages[i - 1].from === messages[i].from &&
                  !messages[i - 1].x?.type
                : false
            }
            isNextMessageYours={
              i < messages.length - 1
                ? messages[i].from === messages[i + 1].from &&
                  !messages[i + 1].x?.type
                : false
            }
          />
        )
      )}
    </InfiniteScroll>
  );
}
