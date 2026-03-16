import type { User } from "types/samaWssModels";

export interface UserProfileProps {
  user: User;
  isMobile: boolean;
  shareRef?: React.Ref<HTMLElement>;
  onLogout: () => void | Promise<void>;
  triggerExitEvent?: () => void;
  /** Called when user taps back (close profile). */
  onClose: () => void;
  /** Called when user taps "Edit User Info" or edit on a field. */
  onEditProfile?: () => void;
  /** Called when user is redirected to auth (e.g. after delete account). */
  onNavigateToAuth?: () => void;
}
