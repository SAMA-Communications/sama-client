import type { Conversation, User } from "types/samaWssModels";

export const KEY_CODES = {
  ESCAPE: 27,
  ENTER: 13,
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37,
};

export const ALLOWED_AVATAR_FORMATS = [".heic", ".HEIC", "image/jpeg", "image/png"];

export const CHAT_CONTENT_TABS = {
  MESSAGES: "messages",
  APPS: "apps",
};

export const TYPING_DURATION_MS = 6000;

export const DEFAULT_MESSAGE_USER_ICON_SIZE = 46;

export const MENU_ITEM_ANIMATE = { height: [0, 35], opacity: [0, 1] } as const;

export const EMPTY_SEARCH_BLOCK_DATA = {
  searchedUsers: [] as User[],
  searchedChats: [] as Conversation[],
  defaultChats: [] as Conversation[],
  isUserSearched: null as string | null,
  isChatSearched: null as string | null,
  isPending: false,
};

export const SCROLLBAR_DEFAULT_MIN_THUMB_HEIGHT = 30;
export const SCROLLBAR_DEFAULT_AUTO_HIDE_DELAY = 300;
export const SCROLLBAR_DEFAULT_HOVER_SHOW_DELAY = 800;
export const SCROLL_STOP_DEBOUNCE_MS = 150;

export const MAX_CHAT_NAME_LENGTH = 255;

export const DEFAULT_BLUR_HASH = "U27nLE$*00_N^k,@s9xu#7$2$%xtVD-B-pkW";

export const VIEWPORT_BREAKPOINTS = {
  MOBILE: 767,
  TABLET: 1279,
  LAPTOP: 1536,
} as const;

export const SEARCH_AREA_MIN_HEIGHT = "0px";
export const SEARCH_AREA_MAX_HEIGHT = "60dvh";

export const PREVIEW_EXPAND_DIRECTION: "down" | "down" = "down";
export const PREVIEW_EXPAND_DURATION_MS = 250;

export const LOAD_MORE_EDGE_PX = 160;
