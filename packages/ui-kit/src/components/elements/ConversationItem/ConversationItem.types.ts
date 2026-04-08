import type { Conversation } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationItemProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Row data from the wire model. */
  conversation: Conversation;
  /** Whether this row matches the active conversation in the parent list. */
  isSelected: boolean;
}

