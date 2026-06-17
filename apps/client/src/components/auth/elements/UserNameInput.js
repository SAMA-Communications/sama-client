import { useEffect, useRef } from "react";

export default function UserNameInput({ setState, isResetModalOpen }) {
  const inputRef = useRef(null);

  useEffect(() => {
    !isResetModalOpen && inputRef.current.focus();
  }, [isResetModalOpen]);

  return (
    <div className="flex w-full rounded-lg bg-(--color-hover-light) px-[14px] py-[7px]">
      <input
        ref={inputRef}
        className="h-[40px] flex-1 font-light outline-none"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) => setState((prev) => ({ ...prev, login: target.value }))}
        placeholder="Enter your login"
        type={"text"}
        autoComplete="off"
        autoFocus
      />
    </div>
  );
}
