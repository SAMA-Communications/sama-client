import type { ReactNode } from "react";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface SearchInputProps extends Omit<WrapperRootProps<"div">, "as" | "children" | "onChange"> {
  /** Placeholder text. */
  placeholder?: string;
  /** Controlled value (use with onChange) or uncontrolled (use with setState for legacy). */
  value?: string;
  /** Controlled change handler (value only, not form event). */
  onChange?: (value: string) => void;
  /** Legacy: callback with current input value (uncontrolled). */
  setState?: (value: string | null) => void;
  /** Larger size for icon and text. */
  isLargeSize?: boolean;
  /** Disable enter animation. */
  disableAnimation?: boolean;
  /** Additional class name for the wrapper. */
  customClassName?: string;
  /** Optional ref for the input element. */
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

