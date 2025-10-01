export default function CustomInput({ setState, name, placeholder }) {
  return (
    <div className="w-full py-[7px] px-[14px] flex bg-(--color-hover-light) rounded-lg">
      <input
        className="h-[40px] flex-1 outline-none"
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
        onChange={({ target }) =>
          setState((prev) => ({ ...prev, [name]: target.value }))
        }
        placeholder={placeholder}
        type={"text"}
        autoComplete="off"
        autoFocus
      />
    </div>
  );
}
