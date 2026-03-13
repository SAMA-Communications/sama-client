import type { WrapperRootProps } from "../../elements/WrapperRoot";

export interface ChatNameInputProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  onConfirm: (name: string, image: File | null) => void;
  onCancel: () => void;
  /** Called when validation fails (e.g. empty name, too long). Client can show alert. */
  onValidationError?: (message: string) => void;
}
