import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface InformativeMessageProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  text: string;
  /** Called when the message is activated. */
  onClick?: () => void;
  /** When true, adds bottom margin (mb-1.5). */
  isNextMessageUsers?: boolean;
}

