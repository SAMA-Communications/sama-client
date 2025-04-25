export default function EditModalInput({
  title,
  systemTitle,
  value,
  onChageFunc,
}) {
  return (
    <div className="flex-1">
      <p className="absolute top-[12px] left-[15px] !font-light z-50">
        {title}
      </p>
      <input
        className=" w-full pt-[38px] px-[15px] pb-[12px] text-h6 text-black !font-light rounded-[12px] bg-(--color-hover-light) focus:outline-none"
        defaultValue={value || ""}
        placeholder={"Empty"}
        onChange={(e) => onChageFunc(systemTitle, e.target.value)}
      />
    </div>
  );
}
