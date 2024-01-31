import { Oval } from "react-loader-spinner";

export default function OvalLoader({ width, height }) {
  return (
    <Oval
      height={width}
      width={height}
      color="#2a2a2a"
      secondaryColor="#6d6d6d"
      wrapperClass={"search__pending"}
      visible={true}
      ariaLabel="oval-loading"
      strokeWidth={2}
      strokeWidthSecondary={3}
    />
  );
}
