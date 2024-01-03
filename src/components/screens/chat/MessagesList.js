import ChatMessage from "../../generic/messageComponents/ChatMessage";
import DownloadManager from "../../../adapters/downloadManager";
import InfiniteScroll from "react-infinite-scroll-component";
import InformativeMessage from "../../generic/messageComponents/InformativeMessage";
import api from "../../../api/api";
import jwtDecode from "jwt-decode";
import {
  addMessages,
  getActiveConversationMessages,
  upsertMessages,
} from "@store/Messages";
import { getConverastionById, upsertChat } from "@store/Conversations";
import { selectParticipantsEntities } from "@store/Participants";
import { useCallback, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MessagesList({ scrollRef }) {
  const dispatch = useDispatch();

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const messages = useSelector(getActiveConversationMessages);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const needToGetMoreMessage = useRef(true);
  const lastMessageRef = useCallback(() => {
    if (!selectedCID || messages.length === 0) {
      return;
    }

    api
      .messageList({
        cid: selectedCID,
        limit: +process.env.REACT_APP_MESSAGES_COUNT_TO_PRELOAD,
        updated_at: { lt: messages[0].created_at },
      })
      .then((arr) => {
        if (!arr.length) {
          needToGetMoreMessage.current = false;
          return;
        }

        const messagesIds = arr.map((el) => el._id).reverse();
        needToGetMoreMessage.current = !(
          messagesIds.length < +process.env.REACT_APP_MESSAGES_COUNT_TO_PRELOAD
        );

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
    const scrollComponent = document.querySelector(
      ".infinite-scroll-component"
    );

    scrollComponent.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setTimeout(() => {
      scrollComponent.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  }, []);

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
            isPrevMesssageUsers={i > 0 ? !messages[i - 1].x?.type : false}
            text={msg.body}
            params={msg.x}
          />
        ) : (
          <ChatMessage
            key={msg._id}
            fromId={msg.from}
            userId={userInfo._id}
            text={msg.body}
            uName={participants[msg.from]?.login}
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
            attachments={msg.attachments}
            status={msg.status}
            tSend={msg.t}
          />
        )
      )}
    </InfiniteScroll>
  );
}
