import { memo } from "react";
import { clsx } from "clsx";
import { Oval } from "react-loader-spinner";

import { WrapperRoot } from "../WrapperRoot";
import type { OvalLoaderProps } from "./OvalLoader.types";

export const OvalLoader = memo(function OvalLoader({
  height = 32,
  width = 32,
  color = "#ffffff",
  wrapperClassName = "",
  className,
  ...rest
}: OvalLoaderProps) {
  return (
    <WrapperRoot data-testid="oval-loader" className={clsx(wrapperClassName, className)} {...rest}>
      <Oval
        height={height}
        width={width}
        color={color}
        secondaryColor="#a0a0a0"
        strokeWidth={4}
        strokeWidthSecondary={4}
        ariaLabel="oval-loading"
        visible
      />
    </WrapperRoot>
  );
});
