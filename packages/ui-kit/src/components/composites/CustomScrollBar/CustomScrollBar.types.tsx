import { CSSProperties, ReactNode, RefObject } from "react";

export interface CustomScrollBarProps {
  children: ReactNode;
  customStyle?: CSSProperties;
  customClassName?: string;
  childrenClassName?: string;
  customId?: string;
  autoHide?: boolean;
  autoHeight?: boolean;
  autoHeightMax?: number | string;
  onScrollStop?: (scrollRef: RefObject<any>) => void;
}
