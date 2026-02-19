export default function InteractiveDate({ date }) {
  const formatedDate = new Date(typeof date === "number" ? date * 1000 : date);

  return (
    <div className="flex justify-center py-2">
      <span className="text-text-dark/40 mb-1.25 p-2 font-light">
        {new Date(formatedDate).toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </span>
    </div>
  );
}
