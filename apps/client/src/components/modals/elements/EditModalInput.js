export default function EditModalInput({
  title,
  systemTitle,
  value,
  onChageFunc,
}) {
  return (
    <div className="flex-1 px-[15px] py-[10px] rounded-[12px] bg-(--color-hover-light)">
      <p className="!font-light text-(--color-text-light)">{title}</p>
      <input
        className=" w-full text-h6 text-black !font-light focus:outline-none"
        defaultValue={value || ""}
        placeholder={"Empty"}
        onChange={(e) => onChageFunc(systemTitle, e.target.value)}
      />
    </div>
  );
}
