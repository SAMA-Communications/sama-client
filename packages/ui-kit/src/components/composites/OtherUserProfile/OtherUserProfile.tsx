import { ChevronLeft, Reply, User } from "lucide-react";

import { CustomVerticalScrollbar } from "@composites/CustomVerticalScrollbar";
import { OtherUserProfileProps } from "@composites/OtherUserProfile/OtherUserProfile.types";

import { DynamicAvatar } from "@elements/DynamicAvatar";
import { InfoBox } from "@elements/InfoBox";
import { WrapperRoot } from "@elements/WrapperRoot";

export const OtherUserProfile = ({
  user,
  displayName,
  statusActivity = "",
  isMobile = false,
  onClose,
  onBack,
  onStartConversation,
  contentClassName = "ui:py-5 ui:flex ui:flex-col ui:gap-3.75 ui:max-md:py-0",
  closeButton,
  backButton,
  className,
  ...rest
}: OtherUserProfileProps) => {
  const { login, email, phone, avatar_url, avatar_object } = user;

  const actionButton = isMobile ? backButton : closeButton;
  const onAction = isMobile ? onBack : onClose;

  return (
    <WrapperRoot className={className} {...rest}>
      <CustomVerticalScrollbar childrenClassName={contentClassName}>
        <div className="ui:relative ui:flex ui:flex-col ui:items-center ui:justify-center ui:gap-5 ui:rounded-[32px] ui:bg-accent-100 ui:py-10 ui:max-md:rounded-t-none">
          {actionButton != null ? (
            <div
              className="ui:absolute ui:top-8 ui:right-8 ui:cursor-pointer ui:max-md:top-8 ui:max-md:left-[4svw]"
              onClick={onAction}
            >
              {actionButton}
            </div>
          ) : (
            <button
              type="button"
              className="ui:absolute ui:top-8 ui:right-8 ui:cursor-pointer ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:max-md:top-8 ui:max-md:left-[4svw]"
              onClick={onAction}
              aria-label={isMobile ? "Back" : "Close"}
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <DynamicAvatar
            size={160}
            avatarUrl={avatar_url}
            avatarBlurHash={avatar_object?.file_blur_hash}
            defaultIcon={<User size={80} color="white" />}
            altText="User's Profile"
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
        <div className="ui:flex ui:flex-col ui:rounded-[32px] ui:bg-bg-light ui:px-5 ui:py-7.5 ui:max-md:flex-1 ui:max-md:rounded-b-none">
          <p className="ui:mb-2.5 ui:text-center ui:text-xl ui:font-normal ui:text-text-dark">Personal information</p>
          <InfoBox iconType="login" title="Username" value={login} hideIfNull />
          <InfoBox iconType="phone" title="Mobile phone" value={phone} hideIfNull />
          <InfoBox iconType="email" title="Email address" value={email} hideIfNull />
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
    </WrapperRoot>
  );
};
