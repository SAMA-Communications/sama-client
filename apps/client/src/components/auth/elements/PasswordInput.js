import { useState } from "react";

import HidePassword from "@icons/actions/HidePassword.svg?react";
import ShowPassword from "@icons/actions/ShowPassword.svg?react";

export default function PasswordInput({ setState }) {
  const [passwordType, setPasswordType] = useState("password");

  return (
    <div className="flex w-full gap-[10px] rounded-lg bg-(--color-hover-light) px-[14px] py-[7px]">
      <input
        className="h-[40px] flex-1 font-light outline-none"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) => setState((prev) => ({ ...prev, password: target.value }))}
        placeholder="Enter your password"
        type={passwordType}
        autoComplete="off"
      />
      <div className="flex cursor-pointer items-center justify-center select-none">
        {passwordType === "password" ? (
          <ShowPassword className="mt-[5px]" onClick={() => setPasswordType("text")} />
        ) : (
          <HidePassword className="mt-[6px]" onClick={() => setPasswordType("password")} />
        )}
      </div>
    </div>
  );
}
