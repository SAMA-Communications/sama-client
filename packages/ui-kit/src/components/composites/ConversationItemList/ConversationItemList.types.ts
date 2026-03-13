import type { WrapperRootProps } from "../../elements/WrapperRoot";
import type { Conversation } from "types/samaWssModels";

export interface ConversationItemListProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  /** Called when a conversation row is clicked (in addition to selection). */
  additionalOnClickfunc: Function;
}
