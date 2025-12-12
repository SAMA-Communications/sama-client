import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LastMessage } from "./LastMessage";
import { attachmentsMock, messagesMock } from "../../../__mocks__";

const mockGetCurrentUser = vi.fn();
const mockGetUserById = vi.fn();
const mockGetFileType = vi.fn();
const mockGetLastMessageUserName = vi.fn();

vi.mock("../../../adapters", () => ({
  getAdapters: () => ({
    mediaUtils: { getFileType: mockGetFileType },
    userUtils: { getLastMessageUserName: mockGetLastMessageUserName },
    useParticipants: () => ({
      getCurrentUser: mockGetCurrentUser,
      getUserById: mockGetUserById,
    }),
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();

  mockGetCurrentUser.mockReturnValue({ _id: "u-x" });

  mockGetUserById.mockImplementation((id: string) => ({
    _id: id,
    first_name: id === "u1" ? "Alice" : "User",
    last_name: "Test",
  }));

  mockGetLastMessageUserName.mockImplementation((user: any) =>
    user?.first_name ? user.first_name : "Unknown"
  );

  mockGetFileType.mockImplementation((name?: string, ct?: string) => {
    if (ct?.startsWith("image")) return "Image";
    if (ct?.startsWith("video")) return "Video";
    if (name?.match(/\.(jpg|png|jpeg)$/i)) return "Image";
    if (name?.match(/\.(mp4|mov|webm)$/i)) return "Video";
    return "File";
  });
});

describe("LastMessage (integrated LastMessageMedia + LastMessageStatus)", () => {
  it("returns null when no message and no draft", () => {
    const { container } = render(<LastMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders draft text when draft exists and no unread messages", () => {
    render(
      <LastMessage draft={{ text: "Draft text" }} countOfUnreadMessages={0} />
    );
    expect(screen.getByText("Draft:")).toBeInTheDocument();
    expect(screen.getByText("Draft text")).toBeInTheDocument();
  });

  it("renders Reply icon when draft has replied_mid", () => {
    render(
      <LastMessage draft={{ replied_mid: "m1" }} countOfUnreadMessages={0} />
    );
    expect(screen.getByTestId("reply-icon")).toBeInTheDocument();
    expect(screen.getByText("Draft:")).toBeInTheDocument();
  });

  it("renders message body when message.body exists", () => {
    const msg = Array.isArray(messagesMock) ? messagesMock[0] : messagesMock;
    mockGetCurrentUser.mockReturnValue({ _id: "someone-else" });

    render(<LastMessage message={msg} countOfUnreadMessages={0} />);
    if (msg.body) {
      expect(screen.getByText(msg.body)).toBeInTheDocument();
    } else {
      expect(screen.getByText(mockGetFileType())).toBeInTheDocument();
    }
  });

  it("renders LastMessageMedia with blurhash when attachment has file_blur_hash", () => {
    const att = { ...attachmentsMock[0] };
    const msg = {
      ...(Array.isArray(messagesMock) ? messagesMock[1] : messagesMock),
      attachments: [att],
    };

    mockGetCurrentUser.mockReturnValue({ _id: "someone-else" });
    render(<LastMessage message={msg} countOfUnreadMessages={0} />);

    expect(screen.getByTestId("blurhash")).toBeInTheDocument();
  });

  it("renders Image/Icon when attachment has no blurhash", () => {
    const att = {
      ...attachmentsMock[1],
      file_blur_hash: undefined,
      file_content_type: "video/mp4",
    };
    const msg = {
      ...(Array.isArray(messagesMock) ? messagesMock[2] : messagesMock),
      attachments: [att],
    };

    mockGetCurrentUser.mockReturnValue({ _id: "someone-else" });
    render(<LastMessage message={msg} countOfUnreadMessages={0} />);

    expect(screen.getByTestId("icon-video")).toBeInTheDocument();
  });

  it("renders username (displayName) when isShowUserName=true and message is not from current user", () => {
    const msg = Array.isArray(messagesMock) ? messagesMock[0] : messagesMock;
    mockGetCurrentUser.mockReturnValue({ _id: "someone-else" });
    mockGetUserById.mockReturnValue({
      _id: msg.from,
      first_name: "Alice",
      last_name: "Cooper",
    });

    render(
      <LastMessage message={msg} isShowUserName countOfUnreadMessages={0} />
    );
    expect(screen.getByText("Alice:")).toBeInTheDocument();
  });

  it("renders unread counter when countOfUnreadMessages > 0", () => {
    const msg = Array.isArray(messagesMock) ? messagesMock[0] : messagesMock;
    mockGetCurrentUser.mockReturnValue({ _id: "someone-else" });

    render(<LastMessage message={msg} countOfUnreadMessages={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.queryByTestId("icon-check")).toBeNull();
    expect(screen.queryByTestId("icon-check-check")).toBeNull();
    expect(screen.queryByTestId("icon-loader")).toBeNull();
  });

  it("renders status icons when message.from === currentUser and no unread messages", async () => {
    const msg = Array.isArray(messagesMock) ? messagesMock[0] : messagesMock;
    mockGetCurrentUser.mockReturnValue({ _id: msg.from });

    const messageSent = { ...msg, status: "sent" as const };
    render(<LastMessage message={messageSent} countOfUnreadMessages={0} />);

    await waitFor(() => {
      expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    });

    const messageRead = { ...msg, status: "read" as const };
    render(<LastMessage message={messageRead} countOfUnreadMessages={0} />);
    await waitFor(() => {
      expect(screen.getByTestId("icon-check-check")).toBeInTheDocument();
    });
  });
});
