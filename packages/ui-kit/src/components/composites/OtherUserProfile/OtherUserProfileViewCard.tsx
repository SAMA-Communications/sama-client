import { X, Reply, User } from "lucide-react";

import { CustomVerticalScrollbar } from "@composites/CustomVerticalScrollbar";
import type { OtherUserProfileUser } from "@composites/OtherUserProfile/OtherUserProfile.types";

import { DynamicAvatar } from "@elements/DynamicAvatar";
import { InfoBox } from "@elements/InfoBox";

export interface OtherUserProfileViewCardProps {
  user: OtherUserProfileUser;
  displayName: string;
  statusActivity?: string;
  isMobile: boolean;
  onAction: () => void;
  onStartConversation?: () => void;
  contentClassName?: string;
}

export function OtherUserProfileViewCard({
  user,
  displayName,
  statusActivity = "",
  isMobile,
  onAction,
  onStartConversation,
  contentClassName = "ui:py-5 ui:flex ui:flex-col ui:gap-3.75 ui:max-md:py-0",
}: OtherUserProfileViewCardProps) {
  const { login, email, phone, avatar_url, avatar_object } = user;

  return (
    <CustomVerticalScrollbar childrenClassName={contentClassName}>
      <div className="ui:relative ui:flex ui:flex-col ui:items-center ui:justify-center ui:gap-5 ui:rounded-[32px] ui:bg-accent-100 ui:py-10 ui:max-md:rounded-t-none">
        <button
          type="button"
          className="ui:absolute ui:top-8 ui:right-8 ui:cursor-pointer ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:hover:bg-black ui:hover:text-white ui:max-md:top-8 ui:max-md:left-[4svw]"
          onClick={onAction}
          aria-label={isMobile ? "Back" : "Close"}
        >
          <X size={18} />
        </button>

        <DynamicAvatar
          size={160}
          avatarUrl={avatar_url}
          avatarBlurHash={avatar_object?.file_blur_hash}
          defaultIcon={<User size={80} color="white" />}
          altText="User's Profile"
          className="rounded-full"
          bgColorKey={user?._id}
        />
        <div className="ui:w-[90%]">
          <p className="ui:-mt-1.25 ui:overflow-hidden ui:text-center ui:text-2xl ui:font-medium ui:text-ellipsis ui:whitespace-nowrap ui:text-black">
            {displayName}
          </p>
          {statusActivity ? (
            <p className="ui:mt-2.5 ui:mb-[-10px] ui:text-center ui:text-base ui:font-light ui:text-text-dark">
              {statusActivity}
            </p>
          ) : null}
        </div>
      </div>
      <div className="ui:flex ui:flex-col ui:gap-2.75 ui:rounded-[32px] ui:bg-bg-light ui:px-5 ui:py-7.5 ui:max-md:flex-1 ui:max-md:rounded-b-none">
        <p className="ui:mb-2.5 ui:text-center ui:text-xl ui:font-normal ui:text-text-dark">Personal information</p>
        <InfoBox iconType="login" title="Username" value={login} hideIfNull />
        <InfoBox iconType="phone" title="Mobile phone" value={phone} hideIfNull />
        <InfoBox iconType="email" title="Email address" value={email} hideIfNull />
        <hr className="ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
        {onStartConversation && (
          <div
            className="ui:mt-2.5 ui:flex ui:cursor-pointer ui:items-center ui:gap-2.5 ui:px-0.5"
            onClick={onStartConversation}
            onKeyDown={(e) => e.key === "Enter" && onStartConversation()}
            role="button"
            tabIndex={0}
          >
            <Reply size={18} color="var(--color-accent-500)" />
            <p className="ui:text-h6 ui:text-accent-500">Start a conversation</p>
          </div>
        )}
      </div>
    </CustomVerticalScrollbar>
  );
}
