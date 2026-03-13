export default function EmailInput({ setState }) {
  return (
    <div className="bg-hover-light flex w-full rounded-lg px-[14px] py-[7px] font-light normal-nums!">
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
