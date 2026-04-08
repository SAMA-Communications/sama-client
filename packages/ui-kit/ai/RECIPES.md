# Composition recipes

Minimal **patterns** for app code using `@sama/ui-kit`. Adjust import paths if your bundler aliases the package differently. These are **guides**, not drop-in files — wire adapters, routes, and state in the host app.

**Prerequisites:** call `setAdapters(...)` from `@sama/ui-kit` (or `@adapters` inside the package) before rendering adapter-dependent trees. See [`ADAPTERS.md`](./ADAPTERS.md).

---

## 1. Conversation list + typing + last message

`ConversationItemList` renders rows built from **`ConversationItem`**, which uses adapters for participants, time labels, and **`LastMessage`** / **`TypingLine`**.

```tsx
import { ConversationItemList } from "@sama/ui-kit";
// setAdapters(...) must provide useParticipants, conversationUtils, userUtils, useConversations

export function ChatSidebar() {
  return (
    <ConversationItemList
      conversations={/* ... */}
      selectedConversationId={/* ... */}
      onConversationClick={/* ... */}
    />
  );
}
```

**Related specs:** `ConversationItemList.md`, `ConversationItem.md`, [`INTERNAL_BUILDING_BLOCKS.md`](./INTERNAL_BUILDING_BLOCKS.md) (`LastMessage`, `WrapperRoot`).

---

## 2. Active chat: header + composer

Header needs **`useParticipants`**, **`useOpponentByCid`** (1:1 title + **`recent_activity`** → online vs **`getLastVisitTime`**), **`useMessages`**, **`useContextMenu`**, **`userUtils`**. Composer needs drafts, messages, conversations, participants.

```tsx
import { ConversationHeader, ConversationInput } from "@sama/ui-kit";

export function ChatPane({ conversationId }: { conversationId: string }) {
  return (
    <>
      <ConversationHeader /* conversation, flags, callbacks */ />
      <ConversationInput /* conversation, disabled flags, callbacks */ />
    </>
  );
}
```

**Related specs:** `ConversationHeader.md`, `ConversationInput.md`, [`ADAPTERS.md`](./ADAPTERS.md).

---

## 3. Search users and chats

Either pass **all list props** explicitly, or pass **`searchText` + `searchOptions`** and implement **`getSearchBlockData`** on adapters.

```tsx
import { SearchBlock } from "@sama/ui-kit";

// Mode A: fully controlled props (searchedUsers, searchedChats, …)
// Mode B: searchText + searchOptions + setAdapters({ getSearchBlockData: () => ({ ... }) })
export function SearchPanel() {
  return <SearchBlock /* pass searchText + searchOptions and/or full list props */ />;
}
```

**Related specs:** `SearchBlock.md`, `SearchConversationList.md`, `SearchedUser.md`.

---

## 4. Group info: participants and avatar

`ConversationInfo` lists **`ParticipantInChat`** rows and shows **`ConversationInfoAvatar`**. Confirm windows and escape handling are internal; deletion uses **`useConversations().deleteAndLeave`**.

```tsx
import { ConversationInfo } from "@sama/ui-kit";

export function GroupDetailsDrawer({ conversation, onClose }: Props) {
  return (
    <ConversationInfo
      conversation={conversation}
      isMobile={false}
      onClose={onClose}
      onParticipantOpenProfile={/* ... */}
      onParticipantContextMenu={/* ... */}
      /* … */
    />
  );
}
```

**Related specs:** `ConversationInfo.md`, [`INTERNAL_BUILDING_BLOCKS.md`](./INTERNAL_BUILDING_BLOCKS.md) (`ParticipantInChat`, `ConversationInfoAvatar`).

---

## 5. Current user profile + edit modal

`UserProfile` uses **`useParticipants`** for password/delete/update paths. **`EditModalContainer`** uses participants + conversations for save flows.

```tsx
import { UserProfile, EditModalContainer } from "@sama/ui-kit";

export function ProfileScreen() {
  return (
    <UserProfile
      user={currentUser}
      onLogout={/* ... */}
      onClose={/* ... */}
    />
  );
}
```

**Related specs:** `UserProfile.md`, `EditModalContainer.md`.

---

## Where to go next

| Need | Doc |
| ---- | --- |
| Full prop tables | `ai/components/<Name>.md` + `components.index.json` |
| Non-exported internals | [`INTERNAL_BUILDING_BLOCKS.md`](./INTERNAL_BUILDING_BLOCKS.md) |
| Adapter methods | [`ADAPTERS.md`](./ADAPTERS.md) |
| Props on type but ignored at runtime | [`TYPE_VS_IMPLEMENTATION.md`](./TYPE_VS_IMPLEMENTATION.md) |
