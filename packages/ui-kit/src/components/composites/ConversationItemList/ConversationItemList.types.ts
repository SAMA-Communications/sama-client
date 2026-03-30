import type { Conversation } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationItemListProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  /** Called when a conversation row is clicked (in addition to selection). */
  additionalOnClickfunc?: Function;
  /** Id of the scroll container; used for scroll position persistence (`scroll_pos_${id}`). */
  scrollContainerId?: string;
  /** Optional class on the scrollbar outer wrapper (flex child). */
  scrollbarClassName?: string;
  /** Optional class on the scrollable content area (passed as `childrenClassName` to the scrollbar). */
  scrollbarContentClassName?: string;
}

