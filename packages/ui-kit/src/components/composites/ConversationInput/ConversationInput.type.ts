import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationInputProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Scroll/layout target for the messages column above the composer. */
  chatMessagesBlockRef: React.RefObject<HTMLDivElement>;
  /** When set, composer is editing this message (`_id` + `body`). */
  editedMessage?: { _id: string; body: string } | null;
  /** Passed to `MessageInput`; default true. */
  isEnableMagicButton?: boolean;
  /** Called when user opens attachment hub. Passed to MessageInput. */
  onOpenAttachmentHub?: () => void;
  /** When true, draft is not restored (attach screen). Passed to MessageInput. */
  isLocationIncludeAttach?: boolean;
}

