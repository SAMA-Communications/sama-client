import { useEffect, useRef } from "react";

export default function UserNameInput({ setState, isResetModalOpen }) {
  const inputRef = useRef(null);

  useEffect(() => {
    !isResetModalOpen && inputRef.current.focus();
  }, [isResetModalOpen]);

  return (
    <div className="w-full py-[7px] px-[14px] flex bg-(--color-hover-light) rounded-lg">
      <input
        ref={inputRef}
        className="h-[40px] flex-1 outline-none"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) =>
          setState((prev) => ({ ...prev, login: target.value }))
        }
        placeholder="Enter your login"
        type={"text"}
        autoComplete="off"
        autoFocus
      />
    </div>
  );
}
