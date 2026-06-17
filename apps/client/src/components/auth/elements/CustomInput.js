export default function CustomInput({ setState, name, placeholder }) {
  return (
    <div className="flex w-full rounded-lg bg-(--color-hover-light) px-[14px] py-[7px]">
      <input
        className="h-[40px] flex-1 outline-none"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) => setState((prev) => ({ ...prev, [name]: target.value }))}
        placeholder={placeholder}
        type={"text"}
        autoComplete="off"
        autoFocus
      />
    </div>
  );
}
