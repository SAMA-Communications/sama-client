import { HTMLAttributes } from "react";

export type IconType = "phone" | "email" | "login";

import type { WrapperRootProps } from "../WrapperRoot";

export interface InfoBoxProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  title: string;
  systemTitle?: string;
  value: string | undefined;
  iconType?: IconType;
  placeholder?: string;
  hideIfNull?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onChangeValue?: (name: string, value: string) => void;
  isEnableToEdit?: boolean;
  isIconEnable?: boolean;
}
