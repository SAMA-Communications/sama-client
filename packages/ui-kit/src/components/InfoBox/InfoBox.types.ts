import { ReactNode } from "react";
import { Variants } from "framer-motion";

export type IconType = "mobile" | "email" | "login";

export interface InfoBoxProps {
  modifier?: string;
  iconType?: IconType;
  title: string | ReactNode;
  placeholder?: string;
  value?: string | number;
  hideIfNull?: boolean;
  onClickFunc?: () => void;
  variants?: Variants;
  initial?: any;
  animate?: any;
  exit?: any;
}
