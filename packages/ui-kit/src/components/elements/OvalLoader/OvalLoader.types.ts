import type { WrapperRootProps } from "../WrapperRoot";

export interface OvalLoaderProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Spinner height in pixels. */
  height?: number;
  /** Spinner width in pixels. */
  width?: number;
  /** Stroke color. */
  color?: string;
  /** Class name for the wrapper (legacy; prefer className). */
  wrapperClassName?: string;
}
