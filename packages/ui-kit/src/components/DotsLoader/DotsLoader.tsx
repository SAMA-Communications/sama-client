import { FC } from "react";
import { ThreeDots } from "react-loader-spinner";

import { DotsLoaderProps } from "./DotsLoader.types";

export const DotsLoader: FC<DotsLoaderProps> = ({
  wrapperClassName = "",
  mainColor = "var(--color-accent-dark)",
  width = 16,
  height = 22,
}) => {
  return (
    <ThreeDots
      visible={true}
      height={height}
      width={width}
      color={mainColor}
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperClass={wrapperClassName}
    />
  );
};
