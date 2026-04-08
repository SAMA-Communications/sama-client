import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface SocketConnectingLineProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** When true, the line is hidden. */
  isSocketConnected: boolean;
  /** Text shown when connecting. */
  message?: string;
}

