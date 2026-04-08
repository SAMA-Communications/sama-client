import type { RefObject } from "react";

import type { Conversation } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ConversationItemListProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  /** Extra handler on row click, alongside default selection (typed as `Function` in source). */
  additionalOnClickfunc?: Function;
  /**
   * External ref to the scrollable element. Use with `disableBuiltinScrollPersistence` when the app
   * owns scroll restore/save (e.g. v2 persistence in `ChatList`).
   */
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  /** Ref on the inner wrapper around rows; used for `ResizeObserver` in the host. */
  listInnerRef?: RefObject<HTMLDivElement | null>;
  /**
   * When true, `CustomVerticalScrollbar` does not read/write `scroll_pos_${scrollContainerId}`.
   */
  disableBuiltinScrollPersistence?: boolean;
  /**
   * Called with scroll distance from bottom (same as scrollbar `onScroll`), e.g. for debounced
   * persistence alongside internal “load more near bottom” behaviour.
   */
  onListScrollFromBottom?: (scrollFromBottom: number) => void;
  /** DOM id of the scroll container (used for built-in `scroll_pos_*` when persistence is enabled). */
  scrollContainerId?: string;
  /** Class names passed to the scrollbar outer flex wrapper. */
  scrollbarClassName?: string;
  /** Class names for the scrollable viewport (`childrenClassName` on the scrollbar). */
  scrollbarContentClassName?: string;
}
