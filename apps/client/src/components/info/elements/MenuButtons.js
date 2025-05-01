import { useLocation } from "react-router";

import addPrefix from "@utils/navigation/add_prefix";

import AccountIcon from "@icons/Menu.svg?react";
import CreateChat from "@icons/AddConversationBlack.svg?react";

export default function MenuButtons() {
  const { pathname, hash } = useLocation();
  return (
    <>
      <AccountIcon
        className="absolute top-[19px] left-[20px] cursor-pointer z-50"
        onClick={() => addPrefix(pathname + hash, "/profile")}
      />
      <div
        className="absolute bottom-[19px] right-[20px] pt-[15px] px-[15px] pb-[10px] rounded-[16px] bg-(--color-accent-light) cursor-pointer z-50"
        onClick={() => addPrefix(pathname + hash, "/create")}
      >
        <CreateChat />
      </div>
    </>
  );
}
