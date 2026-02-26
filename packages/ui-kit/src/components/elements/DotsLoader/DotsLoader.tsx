import { ThreeDots } from "react-loader-spinner";

import { DotsLoaderProps } from "./DotsLoader.types";

export const DotsLoader = ({
  wrapperClassName = "",
  mainColor = "var(--color-accent-500)",
  width = 16,
  height = 22,
}: DotsLoaderProps) => {
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
