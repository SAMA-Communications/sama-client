import { ChevronLeft } from "lucide-react";

import { CustomVerticalScrollbar } from "@composites/CustomVerticalScrollbar";
import { OtherUserProfileProps, OtherUserProfileViewMode } from "@composites/OtherUserProfile/OtherUserProfile.types";
import { OtherUserProfileViewCard } from "@composites/OtherUserProfile/OtherUserProfileViewCard";
import { OtherUserProfileViewCompact } from "@composites/OtherUserProfile/OtherUserProfileViewCompact";

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
  view,
  defaultView = "card",
  className,
  ...rest
}: OtherUserProfileProps) => {
  const activeView: OtherUserProfileViewMode = view ?? defaultView;

  const onAction = isMobile ? onBack : onClose;

  return (
    <WrapperRoot className={className} {...rest}>
      {activeView === "card" && (
        <OtherUserProfileViewCard
          user={user}
          displayName={displayName}
          statusActivity={statusActivity}
          isMobile={isMobile}
          onAction={onAction ?? (() => {})}
          onStartConversation={onStartConversation}
          contentClassName={contentClassName}
        />
      )}
      {activeView === "compact" && (
        <OtherUserProfileViewCompact
          user={user}
          displayName={displayName}
          statusActivity={statusActivity}
          onAction={onAction ?? (() => {})}
          onStartConversation={onStartConversation}
        />
      )}
    </WrapperRoot>
  );
};
