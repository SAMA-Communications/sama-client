import { User } from "../../../types/samaWssModels";

export interface UserProfileProps {
  user: User;
  isMobile: boolean;
  shareRef?: React.Ref<HTMLElement>;
  onLogout: Function;
  triggerExitEvent: Function;
}
