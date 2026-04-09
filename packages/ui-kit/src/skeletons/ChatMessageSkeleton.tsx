import Skeleton from "react-loading-skeleton";

export interface ChatMessageSkeletonProps {
  /** Approximate width of the message bubble (default 280) */
  bubbleWidth?: number;
  /** Additional class for the wrapper */
  className?: string;
}

export const ChatMessageSkeleton = ({ bubbleWidth = 280, className = "" }: ChatMessageSkeletonProps) => {
  return (
    <div
      className={`ui:relative ui:flex ui:w-max ui:max-w-[min(80%,820px)] ui:flex-row ui:gap-4 ${className}`}
      aria-hidden
    >
      <div className="ui:flex ui:min-w-[46px] ui:items-end">
        <Skeleton height={46} width={46} circle />
      </div>
      <div className="ui:min-w-0">
        <Skeleton height={122} width={bubbleWidth} />
      </div>
    </div>
  );
};
