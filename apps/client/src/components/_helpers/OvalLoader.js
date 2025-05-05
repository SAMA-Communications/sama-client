import { Oval } from "react-loader-spinner";

export default function OvalLoader({
  width,
  height,
  customClassName = "",
  secondaryColor,
  mainColor,
}) {
  return (
    <Oval
      height={width}
      width={height}
      color={mainColor || "#2a2a2a"}
      secondaryColor={secondaryColor || "#6d6d6d"}
      wrapperClass={`${customClassName}`}
      visible={true}
      ariaLabel="oval-loading"
      strokeWidth={2}
      strokeWidthSecondary={3}
    />
  );
}
