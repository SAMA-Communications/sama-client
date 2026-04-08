import type { WrapperRootProps } from "@elements/WrapperRoot";

/** Edit conversation or current user inside `Modal`; `...rest` forwarded to `Modal`. */
export interface EditModalContainerProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Which form to show (conversation or user profile). */
  type: "conversation" | "user";
  /** Called when user cancels or after successful save (close modal). */
  onClose: () => void;
}

