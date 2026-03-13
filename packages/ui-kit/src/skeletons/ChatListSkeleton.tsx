import { ConversationItemSkeleton } from "@src/skeletons/ConversationItemSkeleton";

export interface ChatListSkeletonProps {
  /** Number of conversation item skeletons to show (default 8) */
  count?: number;
  /** Additional class for the wrapper */
  className?: string;
}

export const ChatListSkeleton = ({ count = 8, className = "" }: ChatListSkeletonProps) => {
  return (
    <div className={className} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <ConversationItemSkeleton key={i} />
      ))}
    </div>
  );
};
