import Skeleton from "react-loading-skeleton";

export interface ConversationItemSkeletonProps {
  /** Additional class for the wrapper */
  className?: string;
}

export const ConversationItemSkeleton = ({ className = "" }: ConversationItemSkeletonProps) => {
  return (
    <div
      className={`ui:relative ui:flex ui:w-full ui:cursor-pointer ui:items-center ui:gap-3.75 ui:rounded-xl ui:p-2.5 ${className}`}
      aria-hidden
    >
      <div className="ui:flex ui:h-[70px] ui:w-[70px] ui:shrink-0 ui:items-center ui:justify-center ui:overflow-hidden ui:rounded-lg">
        <Skeleton height={80} width={80} />
      </div>
      <div className="ui:flex ui:max-h-[70px] ui:min-w-0 ui:flex-1 ui:flex-col ui:gap-1.75 ui:overflow-hidden">
        <div className="ui:flex ui:items-center ui:justify-between ui:gap-3">
          <span className="ui:block ui:min-w-0 ui:flex-1 ui:overflow-hidden ui:text-ellipsis ui:whitespace-nowrap">
            <Skeleton width={120} />
          </span>
          <span className="ui:shrink-0">
            <Skeleton width={60} />
          </span>
        </div>
        <div className="ui:flex ui:h-8 ui:items-center">
          <Skeleton containerClassName="ui:grow" />
        </div>
      </div>
    </div>
  );
};
