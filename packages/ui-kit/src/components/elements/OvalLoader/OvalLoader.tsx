import { memo } from "react";

import { clsx } from "clsx";
import { Oval } from "react-loader-spinner";

import type { OvalLoaderProps } from "@elements/OvalLoader/OvalLoader.types";
import { WrapperRoot } from "@elements/WrapperRoot";

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

