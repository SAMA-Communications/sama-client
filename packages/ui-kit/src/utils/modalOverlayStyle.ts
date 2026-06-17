import type { CSSProperties } from "react";

export const MODAL_IOS_FULL_BLEED_STYLE: CSSProperties = {
  marginTop: "calc(-1 * env(safe-area-inset-top, 0px))",
  marginRight: "calc(-1 * env(safe-area-inset-right, 0px))",
  marginBottom: "calc(-1 * env(safe-area-inset-bottom, 0px))",
  marginLeft: "calc(-1 * env(safe-area-inset-left, 0px))",
  paddingTop: "env(safe-area-inset-top, 0px)",
  paddingRight: "env(safe-area-inset-right, 0px)",
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
  paddingLeft: "env(safe-area-inset-left, 0px)",
  minHeight: "max(100dvh, 100svh)",
  boxSizing: "border-box",
};
