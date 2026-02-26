import { HTMLAttributes } from "react";

export type IconType = "phone" | "email" | "login";

export interface InfoBoxProps extends HTMLAttributes<HTMLDivElement> {
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
