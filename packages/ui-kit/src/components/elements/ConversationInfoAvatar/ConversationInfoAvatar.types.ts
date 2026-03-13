import type { WrapperRootProps } from "../WrapperRoot";
import type { Conversation } from "types/samaWssModels";

export interface ConversationInfoAvatarProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  conversation: Conversation;
  /** When true, hide the edit overlay. */
  isEditDisabled: boolean;
}
