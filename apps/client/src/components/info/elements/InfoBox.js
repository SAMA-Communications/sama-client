import { motion as m } from "framer-motion";

import Email from "@icons/media/Email.svg?react";
import Phone from "@icons/media/Phone.svg?react";
import User from "@icons/users/User.svg?react";

export default function InfoBox({
  modifier = "",
  iconType = "login",
  title,
  placeholder = "",
  value,
  hideIfNull = false,
  onClickFunc,
  variants = {},
  initial = {},
  animate = {},
  exit = {},
}) {
  if (!value && hideIfNull) {
    return;
  }
  const infoIcons = {
    mobile: <Phone className="w-[16px]" />,
    email: <Email className="w-[16px]" />,
    login: <User className="w-[16px]" />,
  };

  return (
    <m.div
      className={`py-[15px] px-[10px] flex flex-col gap-[10px] rounded-[16px] cursor-pointer ${modifier} hover:bg-(--color-white) max-md:p-[10px] max-md:gap-[5px]`}
      onClick={onClickFunc}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
    >
      <div className={`flex gap-[10px] items-center`}>
        {infoIcons[iconType]}
        <p>{title}</p>
      </div>
      <p
        className={`pl-[26px] text-h6 text-black overflow-hidden text-ellipsis whitespace-nowrap`}
      >
        {value || (
          <span className="text-h6 text-(--color-text-dark)">
            {placeholder}
          </span>
        )}
      </p>
    </m.div>
  );
}
