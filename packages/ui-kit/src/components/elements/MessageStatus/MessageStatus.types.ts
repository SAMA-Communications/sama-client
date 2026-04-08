import type { Message } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface MessageStatusProps extends Omit<WrapperRootProps<"span">, "as" | "children"> {
  status?: "sent" | "read";
  /** When `status` is omitted, `message.status` selects the icon (unknown → clock). */
  message?: Message;
  /** Icon color variant. */
  color?: "accent" | "white";
}

