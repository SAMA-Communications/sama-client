import type { WrapperRootProps } from "@elements/WrapperRoot";

/**
 * Controlled search field: `onChange` receives a string (not a DOM event).
 * Wrapper click focuses the input; non-empty value shows a clear control calling `onChange("")`.
 */
export interface SearchInputProps extends Omit<WrapperRootProps<"div">, "as" | "children" | "onChange"> {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isLargeSize?: boolean;
  customClassName?: string;
}
