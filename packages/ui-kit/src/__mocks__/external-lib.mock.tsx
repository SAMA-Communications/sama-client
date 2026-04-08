import { useMemo } from "react";

import { vi } from "vitest";
import { participantsMock } from "./participants.mock";
import { setAdapters } from "../adapters";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}> {children} </div>,
    },
  };
});

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: any) => <>{children} </>,
  div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock("react-loader-spinner", () => ({
  ThreeDots: () => <div data-testid="dots-loader" />,
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

vi.mock("react-blurhash", () => ({
  Blurhash: ({ hash, width, height, style }: any) => (
    <div data-testid="blurhash" data-hash={hash} data-width={width} data-height={height} style={style} />
  ),
}));

vi.mock("lucide-react", () => ({
  AlertCircle: ({ className, color }: any) => (
    <div data-testid="alert-circle" data-color={color} className={className} />
  ),
  Check: (props: any) => <div data-testid="icon-check" {...props} />,
  CheckCheck: (props: any) => <div data-testid="icon-check-check" {...props} />,
  Clock: (props: any) => <div data-testid="icon-clock" {...props} />,
  Forward: (props: any) => <div data-testid="icon-forward" {...props} />,
  CircleQuestionMark: () => <div data-testid="icon-question" />,
  ImageIcon: (props: any) => <div data-testid="icon-image" {...props} />,
  Loader: (props: any) => <div data-testid="icon-loader" {...props} />,
  Mail: (props: any) => <div data-testid="icon-mail" {...props} />,
  Phone: (props: any) => <div data-testid="icon-phone" {...props} />,
  Reply: (props: any) => <div data-testid="reply-icon" {...props} />,
  User: (props: any) => <div data-testid="icon-user" {...props} />,
  Users: (props: any) => <div data-testid="icon-users" {...props} />,
  VideoIcon: (props: any) => <div data-testid="icon-video" {...props} />,
}));

const useOpponentByCid = (cid: string, currentUserId: string) =>
  useMemo(() => {
    const users = Object.values(participantsMock);
    return users.find((u) => u._id !== currentUserId) ?? null;
  }, [cid, currentUserId]);

const useParticipants = () => {
  return {
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
    getCurrentUser: () => ({ _id: "u1" }),
    getUserById: (id: string) => Object.values(participantsMock).find((u) => u._id === id) || null,
    updateCurrentUserAvatar: vi.fn(),
    updateCurrentUserPassword: vi.fn(),
    updateCurrentUserFields: vi.fn(),
    deleteCurrentUser: vi.fn(),
  };
};

const userUtils = {
  getLastMessageUserName: (user: any) => {
    if (!user) return "Unknown";
    return user.first_name || user.login || "Unknown";
  },
  getUserFullName: (user: any) => {
    if (!user) return null;
    return [user.first_name, user.last_name].filter(Boolean).join(" ") || null;
  },
};

const mediaUtils = {
  getFileType: (name?: string, contentType?: string) => {
    if (!name && !contentType) return "";
    if (contentType?.startsWith("image") || (name && /\.(jpg|jpeg|png|gif)$/i.test(name))) return "Image";
    if (contentType?.startsWith("video") || (name && /\.(mp4|mov|webm)$/i.test(name))) return "Video";
    return "File";
  },
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

const getAdaptersMock = () => ({
  useParticipants,
  useOpponentByCid,
  userUtils,
  mediaUtils,
  useDrafts,
  useConversations: () => ({}),
  useMessages: () => ({}),
  useContextMenu: () => ({}),
});

// @ts-expect-error: Ignore type validation for this line
setAdapters(getAdaptersMock());
