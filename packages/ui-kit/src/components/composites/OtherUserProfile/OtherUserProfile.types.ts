import type { ReactNode } from "react";
import type { WrapperRootProps } from "../../elements/WrapperRoot";

export interface OtherUserProfileUser {
  _id?: string;
  login?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  avatar_object?: { file_blur_hash?: string };
}

export interface OtherUserProfileProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** User data for avatar and info fields */
  user: OtherUserProfileUser;
  /** Display name (e.g. from getUserFullName) */
  displayName: string;
  /** Status/activity line (e.g. "Last seen ...") */
  statusActivity?: string;
  isMobile?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onStartConversation?: () => void;
  /** Optional class for the scroll content wrapper */
  contentClassName?: string;
  /** Close button (desktop); if not provided, uses default icon */
  closeButton?: ReactNode;
  /** Back button (mobile); if not provided, uses default icon */
  backButton?: ReactNode;
}
