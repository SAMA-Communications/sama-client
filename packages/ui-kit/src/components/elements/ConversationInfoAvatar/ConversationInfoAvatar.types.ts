import type { Conversation } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationInfoAvatarProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  conversation: Conversation;
  /** When true, hide the edit overlay. */
  isEditDisabled: boolean;
}

