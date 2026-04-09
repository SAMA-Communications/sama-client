import type { MouseEventHandler, ReactNode } from "react";

import type { Conversation, User } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationHeaderProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Active chat; drives title/participant context. */
  conversation: Conversation;
  /** When true, shows selection toolbar (forward, exit selection). */
  isSelectionMode: boolean;
  /** Selected tab id for the header tab control. */
  currentTab: string;
  /** User switched tabs. */
  changeTabFunc: (tab: string) => void;
  /** Primary close/back control for the chat chrome. */
  closeFormFunc: MouseEventHandler<HTMLButtonElement>;
  /** Optional icon for the close/back button (e.g. X on tablet). When not set, ChevronLeft is used. */
  closeIcon?: ReactNode;
  /** Called when user taps Forward in selection mode. */
  onForwardSection?: () => void;
  /** Called when user cancels selection mode. */
  onCloseSelectionMode?: () => void;
  /** Called when user taps header to open chat/participant info (conversation, participant). */
  onOpenChatOrParticipantInfo?: (conversation: Conversation, participant: User | null) => void;
}

