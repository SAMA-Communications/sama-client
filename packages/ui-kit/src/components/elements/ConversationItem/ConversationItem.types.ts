import type { Conversation } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationItemProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  conversation: Conversation;
  isSelected: boolean;
}

