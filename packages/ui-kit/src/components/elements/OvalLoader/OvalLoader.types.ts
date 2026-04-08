import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface OvalLoaderProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Spinner height in pixels. */
  height?: number;
  /** Spinner width in pixels. */
  width?: number;
  /** Stroke / spinner color (CSS color). */
  color?: string;
  /** Legacy wrapper class; root also accepts `className` from `WrapperRoot`. */
  wrapperClassName?: string;
}

