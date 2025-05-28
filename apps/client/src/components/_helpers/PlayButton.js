export default function PlayButton({ onClickFunc }) {
  return (
    <span
      className="absolute top-1/2 left-1/2 flex justify-center items-center w-[45px] h-[45px] rounded-full bg-(--color-bg-light-50) text-gray-700 transform -translate-x-1/2 -translate-y-1/2"
      onClick={onClickFunc}
    >
      ▶
    </span>
  );
}
