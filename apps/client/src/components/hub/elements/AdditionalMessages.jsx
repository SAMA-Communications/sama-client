import { useSelector } from "react-redux";

import { MediaAttachment, AdditionalMessages as UIAdditionalMessages } from "@sama-communications.ui-kit";

import { selectParticipantsEntities } from "@store/values/Participants.js";

import { getUserFullName } from "@utils/UserUtils.js";

export default function AdditionalMessages({
  message,
  messages,
  type,
  isPreview = false,
  color = "accent",
  onCloseFunc,
  onClickFunc,
}) {
  const participants = useSelector(selectParticipantsEntities);
  const senderId = message?.from ?? messages?.[0]?.from;
  const senderName = senderId ? getUserFullName(participants[senderId]) : "";
  const attachment = message?.attachments?.[0] ?? messages?.[0]?.attachments?.[0];

  return (
    <UIAdditionalMessages
      type={type}
      message={message}
      messages={messages}
      isPreview={isPreview}
      color={color}
      onCloseFunc={onCloseFunc}
      onClickFunc={onClickFunc}
      senderName={senderName}
      attachmentSlot={attachment ? <MediaAttachment index={0} attachment={attachment} flexGrow={1} /> : undefined}
    />
  );
}
