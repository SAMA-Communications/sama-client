import Skeleton from "react-loading-skeleton";

export default function SConversationItem() {
  return (
    <div className="relative w-full p-[10px] flex gap-[15px] items-center rounded-[12px] cursor-pointer ">
      <div className="w-[70px] h-[70px] !font-light text-h4 rounded-[8px] bg-(--color-bg-dark) flex items-center justify-center text-(--color-text-dark) overflow-hidden">
        <Skeleton height={70} width={70} />
      </div>
      <div className="max-w-[calc(100%-90px)] max-h-[70px] flex-1 flex gap-[7px] flex-col overflow-hidden">
        <div className="flex gap-[12px] items-center justify-between">
          <p className="!font-medium text-black text-h6 overflow-hidden text-ellipsis whitespace-nowrap no-underline">
            <Skeleton width={120} />
          </p>
          <div className="!font-light text-(--color-text-light)">
            <Skeleton width={60} />
          </div>
        </div>
        <div className="flex gap-[12px] items-center justify-between h-[32px]">
          <Skeleton containerClassName="grow" />
        </div>
      </div>
    </div>
  );
}
