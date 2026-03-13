import { RefObject, ReactNode, CSSProperties } from "react";

export interface CustomVerticalScrollbarProps {
  /** Ref assigned to the scrollable content container (optional; uses internal ref when not provided) */
  containerRef?: RefObject<HTMLDivElement | null>;
  /** Scrollable content */
  children: ReactNode;
  /** Called when scroll position changes; receives distance from bottom (scrollHeight - scrollTop - clientHeight) */
  onScroll?: (scrollFromBottom: number) => void;
  /** Called when scroll stops (debounced); receives current scrollTop. Use for persisting position. */
  onScrollStop?: (scrollTop: number) => void;
  /** Whether to show the "scroll to bottom" button */
  isScrollToBottomVisible?: boolean;
  /** Called when the user clicks the scroll-to-bottom button */
  onScrollToBottom?: () => void;
  /** Minimum height of the thumb in pixels */
  minThumbHeight?: number;
  /** Delay in ms before hiding the scrollbar after scroll or mouse leave */
  autoHideDelay?: number;
  /** Delay in ms to keep scrollbar visible on track hover before hiding */
  hoverShowDelay?: number;
  /** Id for the scrollable div; when set, scroll position is restored from and saved to localStorage `scroll_pos_${id}` */
  containerId?: string;
  /** Alias for containerId (backward compat with CustomScrollBar) */
  customId?: string;
  /** Optional class for the outer wrapper */
  className?: string;
  /** Optional class for the scrollable content area */
  contentClassName?: string;
  /** Alias for className (backward compat) */
  customClassName?: string;
  /** Alias for contentClassName (backward compat) */
  childrenClassName?: string;
  /** Optional style for the outer wrapper */
  customStyle?: CSSProperties;
  /** When true, outer wrapper uses maxHeight from autoHeightMax instead of full height */
  autoHeight?: boolean;
  /** Max height (px or string) when autoHeight is true */
  autoHeightMax?: number | string;
}
