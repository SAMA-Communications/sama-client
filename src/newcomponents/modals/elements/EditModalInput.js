export default function EditModalInput({
  title,
  systemTitle,
  value,
  onChageFunc,
}) {
  return (
    <div className="edit-modal__input">
      <p>{title}</p>
      <input
        defaultValue={value || ""}
        placeholder={"Empty"}
        onChange={(e) => onChageFunc(systemTitle, e.target.value)}
      />
    </div>
  );
}
