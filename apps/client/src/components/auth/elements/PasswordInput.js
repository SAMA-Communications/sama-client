import { useState } from "react";

import HidePassword from "@icons/actions/HidePassword.svg?react";
import ShowPassword from "@icons/actions/ShowPassword.svg?react";

export default function PasswordInput({ setState }) {
  const [passwordType, setPasswordType] = useState("password");

  return (
    <div className="w-full py-[7px] px-[14px] flex gap-[10px] bg-(--color-hover-light) rounded-lg">
      <input
        className="h-[40px] flex-1 outline-none"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) =>
          setState((prev) => ({ ...prev, password: target.value }))
        }
        placeholder="Enter your password"
        type={passwordType}
        autoComplete="off"
      />
      <div className="flex items-center justify-center select-none cursor-pointer">
        {passwordType === "password" ? (
          <HidePassword
            className="mt-[5px]"
            onClick={() => setPasswordType("text")}
          />
        ) : (
          <ShowPassword
            className="mt-[4px]"
            onClick={() => setPasswordType("password")}
          />
        )}
      </div>
    </div>
  );
}
