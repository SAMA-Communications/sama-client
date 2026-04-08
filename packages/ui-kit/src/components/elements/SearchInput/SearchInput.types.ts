import type { WrapperRootProps } from "@elements/WrapperRoot";

/** Search field; `onChange` is `(value: string) => void`, not a DOM change event. */
export interface SearchInputProps extends Omit<WrapperRootProps<"div">, "as" | "children" | "onChange"> {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isLargeSize?: boolean;
  customClassName?: string;
}
