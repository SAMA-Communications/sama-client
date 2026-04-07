import { ChatMessageSkeleton } from "@src/skeletons/ChatMessageSkeleton";

export interface MessageListSkeletonProps {
  /** Number of message skeletons to show (default 6) */
  count?: number;
  /** Additional class for the outer scroll container */
  className?: string;
  /** ID for the scroll container (e.g. for scroll restoration) */
  scrollContainerId?: string;
}

export const MessageListSkeleton = ({ count = 6, className = "", scrollContainerId }: MessageListSkeletonProps) => {
  return (
    <div className={`ui:h-auto ui:overflow-auto ${className}`} id={scrollContainerId} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <ChatMessageSkeleton key={i} bubbleWidth={260 + (i % 3) * 40} />
      ))}
    </div>
  );
};
