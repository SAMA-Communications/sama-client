# ConversationHeader

## Description

Chat header: **group-owner** tab toggle (messages ↔ apps via `CHAT_CONTENT_TABS`), **selection-mode** toolbar (forward, delete, cancel), **close/back** (`closeFormFunc`, optional `closeIcon`), **overflow** menu (`openContextMenu` with conversation actions), tap on title area to open info (`onOpenChatOrParticipantInfo`).

**Subtitle / status row** (`viewStatusActivity`), adapter-driven:

1. If **`conversation.typing_users`** is non-empty → **`TypingLine`** (group: background + names; 1:1: same component with flags from group check).
2. Else if **direct chat** (`type === "u"`): resolves **opponent** via **`getAdapters().useOpponentByCid(conversation._id, currentUserId)`** (hook-style selector on adapters — must stay in sync with Redux/store participant data in the host). If opponent missing → **no** status row. If **`opponent.recent_activity === 0`** → **“online”** (green dot + accent text). Else → **`userUtils.getLastVisitTime(opponent.recent_activity)`** for last-seen style text.
3. Else **group** → **“N member(s)”** from `participants.length`.

**Adapters:** `useParticipants`, **`useOpponentByCid`**, `useMessages`, `useContextMenu`, `userUtils` (`getLastVisitTime`, `getUserFullName`). Opponent display name for title when conversation has no `name` uses **`getUserFullName(opponentUser)`** or **“Deleted account”**.

**Source:** `src/components/composites/ConversationHeader/ConversationHeader.tsx`, `ConversationHeader.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `conversation` | `Conversation` | Yes | — | Active conversation (`typing_users`, `participants`, `type`, etc.). |
| `isSelectionMode` | `boolean` | Yes | — | Selection toolbar vs normal header. |
| `currentTab` | `string` | Yes | — | Tab id for messages/apps toggle. |
| `changeTabFunc` | `(tab: string) => void` | Yes | — | Tab change. |
| `closeFormFunc` | `MouseEventHandler<HTMLButtonElement>` | Yes | — | Close/back. |
| `closeIcon` | `ReactNode` | No | — | Replaces default `ChevronLeft`. |
| `onForwardSection` | `() => void` | No | — | Selection: forward. |
| `onCloseSelectionMode` | `() => void` | No | — | Selection: cancel (also **Escape** via `useKeyDown`). |
| `onOpenChatOrParticipantInfo` | `(conversation: Conversation, participant: User \| null) => void` | No | — | Title block tap; warns if 1:1 and opponent deleted. |
| `className` | `string` | No | — | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | `WrapperRoot` + `div` + motion. |

## Rules

### Required

- `conversation`, `isSelectionMode`, `currentTab`, `changeTabFunc`, `closeFormFunc`.

### Preferred

- Implement **`setAdapters({ useOpponentByCid, userUtils, … })`** so 1:1 title and **online / last visit** match app state (see [`ADAPTERS.md`](../ADAPTERS.md)).
- Wire `onCloseSelectionMode` when `isSelectionMode` can be true.

## Examples

### Basic

```tsx
<ConversationHeader
  conversation={active}
  isSelectionMode={selecting}
  currentTab={tab}
  changeTabFunc={setTab}
  closeFormFunc={() => router.back()}
  onOpenChatOrParticipantInfo={(c, p) => openInfo(c, p)}
  onForwardSection={forwardSelected}
  onCloseSelectionMode={() => setSelecting(false)}
/>
```

## Anti-patterns

- Empty **`currentTab`** without ids aligned with `changeTabFunc` / `CHAT_CONTENT_TABS`.
- Stale **`recent_activity`** on participants — online/last-seen will be wrong until store updates.
