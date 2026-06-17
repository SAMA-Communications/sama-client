import { useEffect, useState } from "react";

import { VIEWPORT_BREAKPOINTS } from "@utils/constants";

export type ViewportBreakpointsResult = {
  /** True when viewport width <= 767px */
  isMobile: boolean;
  /** True when viewport width is 768px–1279px */
  isTablet: boolean;
  /** True when viewport width is 1280px–1536px (laptop) */
  isLaptop: boolean;
};

function getViewportState(): ViewportBreakpointsResult {
  const w = typeof window === "undefined" ? 1024 : window.innerWidth;
  const { MOBILE, TABLET, LAPTOP } = VIEWPORT_BREAKPOINTS;
  return {
    isMobile: w <= MOBILE,
    isTablet: w > MOBILE && w <= TABLET,
    isLaptop: w > TABLET && w <= LAPTOP,
  };
}

/**
 * Reactive viewport breakpoint hook. Updates on window resize so that
 * components re-render when crossing mobile / tablet / laptop boundaries.
 */
export function useViewportBreakpoints(): ViewportBreakpointsResult {
  const [state, setState] = useState<ViewportBreakpointsResult>(getViewportState);

  useEffect(() => {
    const handleResize = () => setState(getViewportState());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
}
