import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ setState }) {
  const [passwordType, setPasswordType] = useState("password");

  return (
    <div className="bg-hover-light flex w-full gap-[10px] rounded-lg px-[14px] py-[7px]">
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
          <EyeOff className="mt-[5px]" color="grey" onClick={() => setPasswordType("text")} />
        ) : (
          <Eye className="mt-[6px]" color="grey" onClick={() => setPasswordType("password")} />
        )}
      </div>
    </div>
  );
}
