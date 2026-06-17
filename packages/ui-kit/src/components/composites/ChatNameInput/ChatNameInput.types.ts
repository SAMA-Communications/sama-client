import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ChatNameInputProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** After validation: trimmed group name and optional avatar file (first picked file, or `null`). */
  onConfirm: (name: string, image: File | null) => void;
  /** **Cancel** control in the built-in footer. */
  onCancel: () => void;
  /** Called when validation fails (e.g. empty name, too long). Client can show alert. */
  onValidationError?: (message: string) => void;
}

