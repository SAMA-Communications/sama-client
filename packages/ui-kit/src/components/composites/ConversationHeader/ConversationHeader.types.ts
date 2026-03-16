import type { MouseEventHandler, ReactNode } from "react";

import type { Conversation, User } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationHeaderProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  conversation: Conversation;
  isSelectionMode: boolean;
  currentTab: string;
  changeTabFunc: (tab: string) => void;
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

