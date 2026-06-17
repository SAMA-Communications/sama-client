import { createElement, forwardRef, memo } from "react";

import * as m from "motion/react-m";

import { OvalLoader } from "@elements/OvalLoader";
import { MOTION_PROPS, type WrapperRootElement, type WrapperRootProps } from "@elements/WrapperRoot/WrapperRoot.types";

const MOTION_PROPS_SET = new Set<string>(MOTION_PROPS);

function partitionProps(props: Record<string, unknown>): {
  motion: Record<string, unknown>;
  dom: Record<string, unknown>;
} {
  const motion: Record<string, unknown> = {};
  const dom: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (MOTION_PROPS_SET.has(key)) {
      motion[key] = props[key];
    } else {
      dom[key] = props[key];
    }
  }
  return { motion, dom };
}

function hasMotionProps(motion: Record<string, unknown>): boolean {
  return Object.keys(motion).length > 0;
}

export const WrapperRootInner = forwardRef(function WrapperRootInner<E extends WrapperRootElement = "div">(
  props: WrapperRootProps<E>,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const {
    as = "div" as E,
    loading = false,
    skeleton,
    loaderClassName,
    children,
    ...rest
  } = props as WrapperRootProps<E> & { children?: React.ReactNode };

  const { motion: motionProps, dom: domProps } = partitionProps(rest as Record<string, unknown>);
  const useMotion = hasMotionProps(motionProps);

  const content = loading ? (skeleton ?? <OvalLoader wrapperClassName={loaderClassName ?? ""} />) : children;

  const tag = as as string;

  if (useMotion) {
    const MotionTag = (m as Record<string, React.ElementType>)[tag] as React.ElementType | undefined;
    if (!MotionTag) {
      return createElement(tag as React.ElementType, { ...domProps, ref }, content);
    }
    return createElement(MotionTag, { ...domProps, ...motionProps, ref }, content);
  }

  return createElement(tag as React.ElementType, { ...domProps, ref }, content);
}) as <E extends WrapperRootElement = "div">(
  props: WrapperRootProps<E> & { ref?: React.ForwardedRef<HTMLElement> },
) => React.ReactElement;

export const WrapperRoot = memo(WrapperRootInner) as unknown as typeof WrapperRootInner;
