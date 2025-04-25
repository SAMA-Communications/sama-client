import Skeleton from "react-loading-skeleton";

export default function SChatMessage() {
  return (
    <div className="relative w-max max-w-[min(80%,820px)] flex flex-row gap-[16px]">
      <div className="min-w-[46px] flex items-end">
        <Skeleton height={46} width={46} />
      </div>
      <div>
        {/* <CornerLight className="message-content--corner" /> */}
        <Skeleton
          height={122}
          width={Math.floor(Math.random() * (351 - 200) + 250)}
        />
      </div>
    </div>
  );
}
