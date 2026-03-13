import type { WrapperRootProps } from "../WrapperRoot";
import type { Message } from "types/samaWssModels";

export interface MessageStatusProps extends Omit<WrapperRootProps<"span">, "as" | "children"> {
  status?: "sent" | "read";
  message?: Message;
  /** Icon color variant. */
  color?: "accent" | "white";
}
