import type { WrapperRootProps } from "../WrapperRoot";
import type { Conversation } from "types/samaWssModels";

export interface ConversationItemProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  conversation: Conversation;
  isSelected: boolean;
}
