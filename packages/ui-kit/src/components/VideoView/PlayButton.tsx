import { FC } from "react";

interface PlayButtonProps {
  onClickFunc?: () => void;
}

export const PlayButton: FC<PlayButtonProps> = ({ onClickFunc }) => {
  return (
    <span
      className="absolute top-1/2 left-1/2 flex justify-center items-center w-[45px] h-[45px] rounded-full bg-(--color-bg-light-50) text-gray-700 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      onClick={onClickFunc}
    >
      ▶
    </span>
  );
};
