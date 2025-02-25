import Username from "@icons/auth/Username.svg?react";

export default function UserNameInput({ setState }) {
  return (
    <div className="auth-form__input">
      <input
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) =>
          setState((prev) => ({ ...prev, login: target.value }))
        }
        placeholder="Enter your login"
        type={"text"}
        autoComplete="off"
        autoFocus
      />
      <span className="auth-form__placeholder">
        <Username /> Username
      </span>
    </div>
  );
}
