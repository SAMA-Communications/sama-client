/**
 * Vitest mocks for third-party UI libraries and the default `getAdapters()` implementation.
 *
 * Order: dependency mocks (motion, spinners, tooltip, blurhash, lucide) → adapter singleton.
 */
import type { CSSProperties, ReactNode } from "react";
import { useLayoutEffect, useRef, useMemo } from "react";

import { vi } from "vitest";

import { setAdapters } from "../adapters";

import { participantsMock } from "./participants.mock";

// --- framer-motion / motion (minimal DOM shims; expand if a test imports more components) ---

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children, onExitComplete }: any) => {
    const wasVisible = useRef(false);
    useLayoutEffect(() => {
      const visible = Boolean(children);
      if (wasVisible.current && !visible) {
        onExitComplete?.();
      }
      wasVisible.current = visible;
    }, [children, onExitComplete]);
    return <>{children}</>;
  },
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// --- react-loader-spinner ---

vi.mock("react-loader-spinner", () => ({
  ThreeDots: ({ height, width, ariaLabel, "aria-label": ariaLabelAttr, wrapperClass }: any) => (
    <div
      data-testid="dots-loader"
      data-height={height}
      data-width={width}
      aria-label={ariaLabelAttr ?? ariaLabel}
      className={wrapperClass}
    />
  ),
  Oval: ({ height, width, color, secondaryColor }: any) => (
    <div
      data-testid="mock-oval"
      data-height={height}
      data-width={width}
      data-color={color}
      data-secondary-color={secondaryColor}
    />
  ),
}));

// --- react-tooltip ---

vi.mock("react-tooltip", () => ({
  Tooltip: ({ children, id }: any) => (
    <div data-testid="react-tooltip" data-tooltip-id={id}>
      {children}
    </div>
  ),
}));

// --- react-blurhash ---

vi.mock("react-blurhash", () => ({
  Blurhash: ({ hash, width, height, style }: any) => (
    <span data-testid="blurhash" data-hash={hash} data-width={width} data-height={height} style={style} />
  ),
}));

// --- lucide-react (span roots keep markup valid inside <p>; maps color → data-color for assertions) ---

/** Renders a `<span>` with `data-testid` so icons do not violate `validateDOMNesting` inside `<p>`. */
function L(testId: string) {
  return (props: Record<string, unknown>) => {
    const { className, color, style, children, onClick } = props as {
      className?: string;
      color?: string;
      style?: CSSProperties;
      children?: ReactNode;
      onClick?: React.MouseEventHandler<HTMLSpanElement>;
    };
    return (
      <span
        data-testid={testId}
        className={className}
        data-color={color != null ? String(color) : undefined}
        style={style}
        onClick={onClick}
      >
        {children}
      </span>
    );
  };
}

vi.mock("lucide-react", () => ({
  AlertCircle: (props: { className?: string; color?: string }) => (
    <span data-testid="alert-circle" className={props.className} data-color={props.color != null ? String(props.color) : undefined} />
  ),
  Camera: L("icon-camera"),
  Check: L("icon-check"),
  CheckCheck: L("icon-check-check"),
  Clock: L("icon-clock"),
  Forward: L("icon-forward"),
  Image: L("icon-image"),
  CircleQuestionMark: L("icon-question"),
  ImageIcon: L("icon-image"),
  Loader: L("icon-loader"),
  Mail: L("icon-mail"),
  Phone: L("icon-phone"),
  Reply: L("reply-icon"),
  Search: L("icon-search"),
  Sparkles: L("icon-sparkles"),
  SquarePen: L("icon-square-pen"),
  Pencil: L("icon-pencil"),
  ScrollText: L("icon-scroll-text"),
  CloudFog: L("icon-cloud-fog"),
  X: L("icon-x"),
  User: L("icon-user"),
  UserRound: L("icon-user-round"),
  Users: L("icon-users"),
  VideoIcon: L("icon-video"),
  Paperclip: L("icon-paperclip"),
  Send: L("icon-send"),
  Trash2: L("icon-trash"),
  RefreshCcw: L("icon-refresh"),
  File: L("icon-file"),
  UserRoundX: L("icon-user-round-x"),
  WandSparkles: L("icon-wand-sparkles"),
  ChevronDown: L("icon-chevron-down"),
  ChevronLeft: L("icon-chevron-left"),
  ChevronRight: L("icon-chevron-right"),
  MessageCircle: L("icon-message-circle"),
  MessageCircleOff: L("icon-message-circle-off"),
  RotateCcwKey: L("icon-rotate-ccw-key"),
  LogOut: L("icon-log-out"),
  Trash: L("icon-trash-solid"),
  Minimize2: L("icon-minimize-2"),
  Info: L("icon-info"),
  ListStart: L("icon-list-start"),
  UserPlus: L("icon-user-plus"),
  EllipsisVertical: L("icon-ellipsis-vertical"),
  Code: L("icon-code"),
}));

/** Stable object so tests can assert the same `vi.fn` references that components receive from `getAdapters()`. */
const participantsAdapterImpl = {
  getParticipantsByIdsAsObject: (ids?: string[]) => {
    const list = ids ?? [];
    const obj: Record<string, (typeof participantsMock)[keyof typeof participantsMock]> = {};
    for (const id of list) {
      const u = Object.values(participantsMock).find((p) => p._id === id);
      if (u) obj[id] = u;
    }
    return obj;
  },
  getOpponentByCid: (_cid: string, _uid: string) => participantsMock.u2,
  getParticipantsByIdsAsList: (ids: string[]) =>
    ids?.length
      ? ids.map(
          (id) =>
            Object.values(participantsMock).find((u) => u._id === id) || {
              _id: id,
              first_name: id,
            },
        )
      : [],
  getCurrentUser: () => participantsMock.u1,
  getUserById: (id: string) => Object.values(participantsMock).find((u) => u._id === id) || null,
  updateCurrentUserAvatar: vi.fn(),
  updateCurrentUserPassword: vi.fn(),
  updateCurrentUserFields: vi.fn(),
  deleteCurrentUser: vi.fn(),
};

const useParticipants = () => participantsAdapterImpl;

const useOpponentByCid = (cid: string, currentUserId: string) =>
  useMemo(() => {
    const users = Object.values(participantsMock);
    return users.find((u) => u._id !== currentUserId) ?? null;
  }, [cid, currentUserId]);

const userUtils = {
  getLastMessageUserName: (user: any) => {
    if (!user) return "Unknown";
    return user.first_name || user.login || "Unknown";
  },
  getUserFullName: (user: any) => {
    if (!user) return null;
    return [user.first_name, user.last_name].filter(Boolean).join(" ") || null;
  },
  getUserInitials: (user: any) => (user?.first_name?.charAt(0) || user?.login?.charAt(0) || "?").toUpperCase(),
  getLastVisitTime: () => "",
};

const mediaUtils = {
  getFileType: (name?: string, contentType?: string) => {
    if (!name && !contentType) return "";
    if (contentType?.startsWith("image") || (name && /\.(jpg|jpeg|png|gif)$/i.test(name))) return "Image";
    if (contentType?.startsWith("video") || (name && /\.(mp4|mov|webm)$/i.test(name))) return "Video";
    return "File";
  },
  extractFilesFromClipboard: () => [],
};

const conversationUtils = {
  getLastUpdateTime: () => "12:00",
};

/** Property name matches `Adapters` / app spelling (`formated`, not `formatted`). */
const formatedUtils = {
  calcInputHeight: () => 24,
};

const useDrafts = () => ({
  syncDraftByCid: vi.fn(),
  saveDraft: vi.fn(),
  flushDraftToLocalStorage: vi.fn(),
  removeDraft: vi.fn(),
  removeDraftWithOptions: vi.fn(),
  purgeDraft: vi.fn(),
  pushLocalDraftToReduxNow: vi.fn(),
  savePreEditComposeText: vi.fn(),
  consumePreEditComposeText: vi.fn(() => ""),
  getDraft: vi.fn(() => ({})),
  getDraftField: vi.fn(),
  getDraftMessage: vi.fn(() => ""),
  getDraftRepliedMessageId: vi.fn(),
  getDraftEditedMessageId: vi.fn(),
  saveLastInputText: vi.fn(),
  getLastInputText: vi.fn(() => ""),
  getExternalProps: vi.fn(() => ({})),
});

const conversationsAdapterImpl = {
  getSelectedConversation: () => ({ _id: "mock-cid" }),
  sendTypingStatus: vi.fn(),
  updateChatImage: vi.fn(),
  setSelectedConversation: vi.fn(),
  storeNewConversations: vi.fn(),
  getConversationById: vi.fn(),
  fetchConversations: vi.fn(() => Promise.resolve([])),
  updateNameAndDescription: vi.fn(),
  deleteAndLeave: vi.fn(),
};

const messagesAdapterImpl = {
  summarizeMessages: vi.fn(() => Promise.resolve()),
  changeMessageTone: vi.fn(() => Promise.resolve(null)),
  deleteSelectedMessages: vi.fn(),
  getSelectedMessages: vi.fn(() => ({ countOfSelectedMessages: 0, midsArrayOfSelectedMessages: [] as string[] })),
  editMessage: vi.fn(() => Promise.resolve("")),
  createAndSendMessage: vi.fn(
    async (
      _input: string,
      _sel: unknown,
      _draft: unknown,
      _flag: boolean,
      _disable: () => void,
      enable: () => void,
      onDone?: () => void,
    ) => {
      enable?.();
      onDone?.();
      return "";
    },
  ),
};

const contextMenuAdapterImpl = {
  openContextMenu: vi.fn(),
};

/** Default adapter bundle wired into `setAdapters` below for every Vitest run. */
const getAdaptersMock = () => ({
  useParticipants,
  useOpponentByCid,
  userUtils,
  mediaUtils,
  conversationUtils,
  formatedUtils,
  useDrafts,
  useConversations: () => conversationsAdapterImpl,
  useMessages: () => messagesAdapterImpl,
  useContextMenu: () => contextMenuAdapterImpl,
});

// @ts-expect-error Mock satisfies runtime adapter usage; full `Adapters` type is wider than this bundle.
setAdapters(getAdaptersMock());
