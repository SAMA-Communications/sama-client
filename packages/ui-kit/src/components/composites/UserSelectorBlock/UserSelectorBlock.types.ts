import { ReactNode } from "react";

import type { User } from "types/samaWssModels";

export interface UserSelectorBlockProps {
  /** Controlled selected users (client holds state and passes to SearchBlock too) */
  selectedUsers: User[];
  onAddUser: (user: User) => void;
  onRemoveUser: (user: User) => void;
  /** When adding to existing chat, these users are pre-selected and not in "to add" count */
  initSelectedUsers?: User[];
  onClose: () => void;
  /** Called with selected user list when user clicks Create/Add */
  onCreate: (users: User[]) => void | Promise<void>;
  /** Search input element (client provides e.g. SearchInput) */
  searchInputSlot: ReactNode;
  /** Search results / user list (client provides e.g. SearchBlock) */
  searchResultsSlot: ReactNode;
  /** Max participants (default 50) */
  maxCount?: number;
  /** Label for submit button: "Create" or "Add" */
  submitLabel?: "Create" | "Add";
}

