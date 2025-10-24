import { FC } from "react";

interface PlayButtonProps {
  onClick?: () => void;
}

export const PlayButton: FC<PlayButtonProps> = ({ onClick }) => {
  return (
    <span
      data-testid="play-button"
      className="absolute top-1/2 left-1/2 flex justify-center items-center w-[45px] h-[45px] rounded-full bg-(--color-bg-light-50) text-gray-700 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      onClick={onClick}
    >
      ▶
    </span>
  );
};
