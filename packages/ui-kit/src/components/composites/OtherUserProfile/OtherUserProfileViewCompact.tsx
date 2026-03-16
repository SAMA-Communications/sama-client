import { ChevronLeft, Reply, User } from "lucide-react";

import type { OtherUserProfileUser } from "@composites/OtherUserProfile/OtherUserProfile.types";

import { DynamicAvatar } from "@elements/DynamicAvatar";
import { InfoBox } from "@elements/InfoBox";

export interface OtherUserProfileViewCompactProps {
  user: OtherUserProfileUser;
  displayName: string;
  statusActivity?: string;
  onAction: () => void;
  onStartConversation?: () => void;
}

export function OtherUserProfileViewCompact({
  user,
  displayName,
  statusActivity = "",
  onAction,
  onStartConversation,
}: OtherUserProfileViewCompactProps) {
  const { login, email, phone, avatar_url, avatar_object } = user;

  return (
    <section className="ui:flex ui:min-h-0 ui:w-full ui:flex-1 ui:flex-col ui:gap-2.75 ui:p-3.5 ui:md:w-100">
      <div className="ui:relative ui:flex ui:flex-col ui:items-center ui:justify-center ui:gap-2.75">
        <div className="ui:flex ui:w-full ui:justify-between">
          <button
            type="button"
            className="ui:mb-1.5 ui:cursor-pointer ui:self-start ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:hover:bg-bg-dark ui:hover:text-white"
            onClick={onAction}
            aria-label="Back"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <div className="ui:flex ui:h-30 ui:w-30 ui:items-center ui:justify-center ui:self-center ui:overflow-hidden ui:rounded-full ui:bg-bg-light">
          <DynamicAvatar
            size={120}
            avatarUrl={avatar_url}
            avatarBlurHash={avatar_object?.file_blur_hash}
            defaultIcon={<User size={80} color="white" />}
            altText="User's Profile"
          />
        </div>
        <div className="ui:flex ui:w-4/5 ui:flex-nowrap ui:items-center ui:justify-center ui:gap-2.75">
          <p className="ui:overflow-hidden ui:text-center ui:text-2xl ui:text-ellipsis ui:whitespace-nowrap">
            {displayName}
          </p>
        </div>
        {statusActivity ? (
          <p className="ui:-mt-1.75 ui:text-center ui:text-lg ui:text-text-dark">{statusActivity}</p>
        ) : null}
      </div>
      <hr className="ui:mt-5 ui:mb-2.5 ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
      <div className="ui:flex ui:flex-1 ui:flex-col ui:gap-2.75">
        <p className="ui:mb-2.75 ui:text-xl">Personal information</p>
        <InfoBox title="Username" value={login} iconType="login" hideIfNull />
        <InfoBox title="Phone number" value={phone} iconType="phone" hideIfNull />
        <InfoBox title="Email address" value={email} iconType="email" hideIfNull />

        {onStartConversation && (
          <>
            <hr className="ui:mt-5 ui:mb-2.5 ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
            <div
              className="ui:mt-2.75 ui:flex ui:cursor-pointer ui:items-center ui:justify-center ui:gap-2.75 ui:rounded-xl ui:bg-white ui:p-2 ui:text-accent-500 ui:shadow-btn ui:duration-150 ui:hover:bg-accent-500 ui:hover:text-white"
              onClick={onStartConversation}
              onKeyDown={(e) => e.key === "Enter" && onStartConversation()}
              role="button"
              tabIndex={0}
            >
              <Reply size={18} />
              <span>Start a conversation</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
