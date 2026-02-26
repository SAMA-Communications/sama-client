import { Oval } from "react-loader-spinner";

import { OvalLoaderProps } from "./OvalLoader.types";

export const OvalLoader = ({ height = 32, width = 32, color = "#ffffff", wrapperClassName = "" }: OvalLoaderProps) => {
  return (
    <div data-testid="oval-loader" className={wrapperClassName}>
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
