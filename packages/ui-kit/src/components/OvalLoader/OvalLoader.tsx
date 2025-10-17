import { FC } from "react";
import { Oval } from "react-loader-spinner";
import { OvalLoaderProps } from "./OvalLoader.types";

export const OvalLoader: FC<OvalLoaderProps> = ({
  height = 32,
  width = 32,
  color = "#ffffff",
  customClassName = "",
}) => {
  return (
    <div className={customClassName}>
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
    </div>
  );
};
