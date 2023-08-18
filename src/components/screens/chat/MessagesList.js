import ChatMessage from "../../generic/ChatMessage";
import api from "../../../api/api";
import jwtDecode from "jwt-decode";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  addMessages,
  getActiveConversationMessages,
  upsertMessages,
} from "../../../store/Messages";
import { getConverastionById, upsertChat } from "../../../store/Conversations";
import { getDownloadFileLinks } from "../../../api/download_manager";
import { selectParticipantsEntities } from "../../../store/Participants";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MessagesList({ scrollRef, openModalFunc }) {
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
        needToGetMoreMessage.current =
          messagesIds.length <=
          +process.env.REACT_APP_MESSAGES_COUNT_TO_PRELOAD;

        dispatch(addMessages(arr));
        dispatch(
          upsertChat({
            _id: selectedCID,
            messagesIds: [...messagesIds, ...messages.map((el) => el._id)],
            activated: true,
          })
        );
        const mAttachments = {};
        arr.forEach((message) => {
          const attachments = message.attachments;
          if (attachments) {
            attachments.forEach((obj) => {
              mAttachments[obj.file_id] = { _id: message._id, ...obj };
            });
          }
        });

        if (Object.keys(mAttachments).length > 0) {
          getDownloadFileLinks(mAttachments).then((msgs) =>
            dispatch(upsertMessages(msgs))
          );
        }
      });
  }, [selectedCID, messages, needToGetMoreMessage]);

  return (
    <InfiniteScroll
      ref={scrollRef}
      dataLength={messages.length}
      next={lastMessageRef}
      style={{ display: "flex", flexDirection: "column" }}
      inverse={true}
      hasMore={true && needToGetMoreMessage.current}
      scrollableTarget="chatMessagesScrollable"
    >
      {messages.map((msg, i) => (
        <ChatMessage
          key={msg._id}
          fromId={msg.from}
          userId={userInfo._id}
          text={msg.body}
          uName={participants[msg.from]?.login}
          isPrevMesssageYours={
            i > 0 ? messages[i - 1].from === messages[i].from : false
          }
          isNextMessageYours={
            i < messages.length - 1
              ? messages[i].from === messages[i + 1].from
              : false
          }
          attachments={msg.attachments}
          openModalParam={openModalFunc}
          status={msg.status}
          tSend={msg.t}
        />
      ))}
    </InfiniteScroll>
  );
}
