import { ReactComponent as Username } from "@icons/auth/Username.svg";

export default function UserNameInput({ setState }) {
  return (
    <div className="auth-form__input">
      {/* /[A-Za-z0-9_\-.@]{3,20}/  "The username is a required field." */}
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
