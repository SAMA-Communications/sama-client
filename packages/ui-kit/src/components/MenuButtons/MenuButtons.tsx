import { FC } from "react";
import { MenuButtonsProps } from "./MenuButtons.types";
import { User, MessageCircle } from "lucide-react";

export const MenuButtons: FC<MenuButtonsProps> = ({
  onProfileClick,
  onCreateClick,
}) => {
  return (
    <>
      <User
        className="absolute top-[24px] left-[24px] transform -translate-1/2 cursor-pointer z-50"
        size={24}
        onClick={onProfileClick}
      />
      <div
        className="absolute bottom-[19px] right-[20px] pt-[15px] px-[15px] pb-[10px] rounded-[16px] bg-(--color-accent-light) cursor-pointer z-50 flex items-center justify-center"
        onClick={onCreateClick}
      >
        <MessageCircle size={24} />
      </div>
    </>
  );
};
