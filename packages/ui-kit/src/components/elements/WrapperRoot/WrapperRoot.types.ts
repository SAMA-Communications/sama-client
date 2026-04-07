import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type WrapperRootElement = keyof React.JSX.IntrinsicElements & string;

export const MOTION_PROPS = [
  "variants",
  "initial",
  "animate",
  "exit",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileInView",
  "whileDrag",
  "transition",
  "layout",
  "layoutId",
  "drag",
  "dragConstraints",
  "dragDirectionLock",
  "dragElastic",
  "dragMomentum",
  "onDrag",
  "onDragStart",
  "onDragEnd",
  "onAnimationStart",
  "onAnimationComplete",
] as const;

export type MotionPropKey = (typeof MOTION_PROPS)[number];

export interface WrapperRootOwnProps {
  /** Root element type (e.g. "div", "section", "span"). Default "div". */
  as?: WrapperRootElement;
  /** When true, show skeleton or loader instead of children. */
  loading?: boolean;
  /** Custom placeholder when loading. If omitted and loading is true, OvalLoader is used. */
  skeleton?: ReactNode;
  /** Skeleton/loader wrapper className when using default OvalLoader. */
  loaderClassName?: string;
}

export interface WrapperRootMotionProps {
  variants?: Record<string, unknown>;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  whileFocus?: unknown;
  whileInView?: unknown;
  whileDrag?: unknown;
  transition?: unknown;
  layout?: boolean | "position" | "size";
  layoutId?: string;
  drag?: boolean | "x" | "y";
  dragConstraints?: unknown;
  dragDirectionLock?: boolean;
  dragElastic?: unknown;
  dragMomentum?: boolean;
  onDrag?: (event: unknown, info: unknown) => void;
  onDragStart?: (event: unknown, info: unknown) => void;
  onDragEnd?: (event: unknown, info: unknown) => void;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

export type WrapperRootForwardedProps<E extends ElementType = "div"> = Omit<
  ComponentPropsWithoutRef<E>,
  keyof WrapperRootOwnProps | MotionPropKey
>;

export type WrapperRootProps<E extends WrapperRootElement = "div"> = WrapperRootOwnProps &
  Partial<ComponentPropsWithoutRef<E>> &
  Partial<WrapperRootMotionProps>;
