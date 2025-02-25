import { useState } from "react";

import HidePassword from "@icons/actions/HidePassword.svg?react";
import ShowPassword from "@icons/actions/ShowPassword.svg?react";
import Password from "@icons/auth/Password.svg?react";

export default function PasswordInput({ setState }) {
  const [passwordType, setPasswordType] = useState("password");

  return (
    <div className="auth-form__input">
      <input
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) =>
          setState((prev) => ({ ...prev, password: target.value }))
        }
        placeholder="Enter your password"
        type={passwordType}
        autoComplete="off"
      />
      <div className="auth-form__password-visibility fcc">
        {passwordType === "password" ? (
          <HidePassword onClick={() => setPasswordType("text")} />
        ) : (
          <ShowPassword onClick={() => setPasswordType("password")} />
        )}
      </div>
      <span className="auth-form__placeholder">
        <Password /> Password
      </span>
    </div>
  );
}
