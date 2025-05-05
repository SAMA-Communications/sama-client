import { useState } from "react";

import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";

import Unselect from "@icons/status/Unselect.svg?react";

export default function UserInfo({ uObject, onClickFunc }) {
  const [visibleCloseBtn, setVisibleCloseBtn] = useState(false);

  return (
    <div
      className="min-w-max max-h-[32px] p-[4px] flex flex-row gap-[7px] items-center rounded-[12px] bg-(--color-hover-light) cursor-pointer"
      onClick={onClickFunc}
      onMouseEnter={() => setVisibleCloseBtn(true)}
      onMouseLeave={() => setVisibleCloseBtn(false)}
    >
      <div className="w-[24px] h-[24px] rounded-[8px] bg-(--color-bg-dark) flex items-center justify-center">
        <p className="text-(--color-text-dark) ">
          {visibleCloseBtn ? <Unselect /> : getUserInitials(uObject)}
        </p>
      </div>
      <p>{getUserFullName(uObject)}</p>
    </div>
  );
}
