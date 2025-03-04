import { ThreeDots } from "react-loader-spinner";

export default function DotsLoader({ width, height, mainColor }) {
  return (
    <ThreeDots
      visible={true}
      height={width}
      width={height}
      color={mainColor || " var(--color-accent-dark)"}
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass={"typing-dots"}
    />
  );
}
