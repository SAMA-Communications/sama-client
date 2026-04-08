import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface SearchInputProps extends Omit<WrapperRootProps<"div">, "as" | "children" | "onChange"> {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isLargeSize?: boolean;
  customClassName?: string;
}
