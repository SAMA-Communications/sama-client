export default function EmailInput({ setState }) {
  return (
    <div className="w-full py-[7px] px-[14px] flex bg-(--color-hover-light) rounded-lg">
      <input
        className="h-[40px] flex-1 outline-none"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) =>
          setState((prev) => ({ ...prev, email: target.value }))
        }
        placeholder="Enter your email"
        type={"text"}
        autoComplete="off"
        autoFocus
      />
    </div>
  );
}
