import type { Message } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface MessageStatusProps extends Omit<WrapperRootProps<"span">, "as" | "children"> {
  status?: "sent" | "read";
  message?: Message;
  /** Icon color variant. */
  color?: "accent" | "white";
}

