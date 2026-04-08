# Adapters (`setAdapters` / `getAdapters`)

Many composites and elements **do not** fetch data from React context. They call **`getAdapters()`** from `@adapters` (re-exported as `setAdapters` / `getAdapters` from the package root). The host app must call **`setAdapters(partial)`** once (or when wiring changes) with real implementations.

**Canonical TypeScript contract:** `src/adapters/types.ts` (`SamaAdapters` and nested `use*` return types). **Default no-op stubs:** `src/adapters/defaults.ts` (used until the app replaces them).

**Merge behavior:** `setAdapters` **deep-merges** into the current object (`src/adapters/manager.ts`). Arrays in the patch are **concatenated** with existing arrays — prefer replacing whole adapter slices with a fresh object from the app if you rely on full replacement.

---

## `SamaAdapters` surface (summary)

| Namespace | Role |
| --------- | ---- |
| `useDrafts()` | Draft sync, local storage, compose text for edit/reply/forward. |
| `useParticipants()` | Users, current user, avatar/password/profile updates, delete user. |
| `useConversations()` | Selected conversation, list fetch/store, chat image/name, typing, leave/delete. |
| `useMessages()` | Selection, send/edit/summarize/tone, bulk delete. |
| `useContextMenu()` | Open context menu by category + item ids + coords. |
| `useOpponentByCid(cid, currentUserId)` | Returns **`User | null`** for the **1:1** opponent (not for groups). Hook-style: must be called during render like a React hook; host usually backs it with `useSelector`. Used by **`ConversationHeader`** for title + **`recent_activity`** → online (`0`) or **`userUtils.getLastVisitTime`**. |
| `userUtils` | Display names, initials, **`getLastVisitTime(timestamp)`** for last-seen strings. |
| `conversationUtils` | Last-update label from conversation + last message time. |
| `mediaUtils` | File type label, clipboard files. |
| `formatedUtils` | Time formatting, textarea height helper. |
| `getSearchBlockData?` | Optional. When set, **`SearchBlock`** can derive list state from adapters if `searchText` + `searchOptions` are passed — see `SearchBlock.tsx`. |

---

## Which components use what

Use this when wiring or debugging “component does nothing” / wrong data.

| Component | Adapters used |
| --------- | ------------- |
| `ConversationInput` | `useDrafts`, `useMessages`, `useConversations`, `useParticipants`, `formatedUtils` |
| `MessageInput` | `useConversations`, `useDrafts`, `formatedUtils`, `mediaUtils` |
| `MagicButton` | `useConversations`, `useMessages` |
| `ConversationHeader` | `useParticipants`, **`useOpponentByCid`**, `useMessages`, `useContextMenu`, `userUtils` |
| `ConversationItemList` | `useConversations` |
| `ConversationItem` | `useParticipants`, `conversationUtils`, `userUtils` |
| `TypingLine` | `useParticipants`, `userUtils` |
| `LastMessage` *(internal)* | `mediaUtils`, `userUtils`, `useParticipants` |
| `SearchBlock` | `getSearchBlockData` (optional path); no other adapter calls in component body |
| `SearchedUser` | `userUtils` |
| `MessageUserIcon` | `userUtils` |
| `UserInfo` | `userUtils` |
| `ParticipantInChat` *(internal)* | `useParticipants`, `userUtils` |
| `ConversationInfo` | `useParticipants`, `useConversations` |
| `ConversationInfoAvatar` *(internal)* | `useConversations` (`updateChatImage`) |
| `UserProfile` | `useParticipants` |
| `UserProfileAvatar` *(internal)* | `useParticipants` (`updateCurrentUserAvatar`) |
| `EditModalContainer` | `useParticipants`, `useConversations` |
| `EditModalContainer` → `UserInputsGroup` | `useParticipants` |
| `EditModalContainer` → `ConversationInputsGroup` | `useConversations` |

Components **not** in this table typically do not call `getAdapters()` (or only use hooks like `useConfirmWindow` locally — see `ConversationInfo`).

---

## Agent / author notes

- **Props alone** are not enough for composer, list selection, search adapter mode, or profile avatar upload — the matching adapter methods must be implemented.
- For **internal** pieces that also use adapters, see [`INTERNAL_BUILDING_BLOCKS.md`](./INTERNAL_BUILDING_BLOCKS.md).
- For **type vs runtime** oddities on public props, see [`TYPE_VS_IMPLEMENTATION.md`](./TYPE_VS_IMPLEMENTATION.md).
