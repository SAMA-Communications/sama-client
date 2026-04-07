import type { User } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ParticipantContextMenuParams {
  category: string;
  list: (string | null)[];
  coords: { x: number; y: number };
  externalProps?: { userObject: User };
  clicked: boolean;
}

export interface ParticipantInChatProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  user: User;
  isOwner: boolean;
  isCurrentUserOwner: boolean;
  /** Called when row is clicked. uid = participant id, or null for current user. */
  onOpenProfile?: (uid: string | null) => void;
  /** Called when context menu is requested (our callback). DOM onContextMenu is forwarded via rootProps. */
  onRequestContextMenu?: (params: ParticipantContextMenuParams) => void;
}
