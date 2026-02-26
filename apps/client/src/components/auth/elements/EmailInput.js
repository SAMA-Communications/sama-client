export default function EmailInput({ setState }) {
  return (
    <div className="flex w-full rounded-lg bg-(--color-hover-light) px-[14px] py-[7px] font-light">
      <input
        className="h-[40px] flex-1 outline-none"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) => setState((prev) => ({ ...prev, email: target.value }))}
        placeholder="Enter your email"
        type={"text"}
        autoComplete="off"
        autoFocus
      />
    </div>
  );
}
