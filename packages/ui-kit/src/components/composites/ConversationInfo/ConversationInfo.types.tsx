import type { Conversation, User } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationInfoProps extends Omit<WrapperRootProps<"section">, "as" | "children"> {
  conversation: Conversation;
  isMobile: boolean;
  /** Optional ref for parent (e.g. share target). */
  shareRef?: React.Ref<HTMLDivElement>;
  /** Called when user closes the info panel (e.g. back button). */
  onClose: () => void;
  /** Called when user taps "Edit Group Info". */
  onEditConversation?: () => void;
  /** Called when user taps "Add participants". */
  onAddParticipants?: () => void;
  /** Called when a participant row is clicked (uid = participant id, or null for current user). */
  onParticipantOpenProfile?: (uid: string | null) => void;
  /** Called when context menu is requested on a participant. */
  onParticipantContextMenu?: (params: {
    category: string;
    list: (string | null)[];
    coords: { x: number; y: number };
    externalProps?: { user: User };
    clicked: boolean;
  }) => void;
}

