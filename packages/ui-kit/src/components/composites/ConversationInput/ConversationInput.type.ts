import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationInputProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  chatMessagesBlockRef: React.RefObject<HTMLDivElement>;
  editedMessage?: { _id: string; body: string } | null;
  isEnableMagicButton?: boolean;
  /** Called when user opens attachment hub. Passed to MessageInput. */
  onOpenAttachmentHub?: () => void;
  /** When true, draft is not restored (attach screen). Passed to MessageInput. */
  isLocationIncludeAttach?: boolean;
}

