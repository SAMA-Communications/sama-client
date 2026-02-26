export interface ConversationInputProps {
  chatMessagesBlockRef: React.RefObject<HTMLDivElement>;
  editedMessage: { _id: string; body: string };
  isEnableMagicButton: boolean;
}
