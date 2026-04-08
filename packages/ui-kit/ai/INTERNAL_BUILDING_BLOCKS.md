# Internal building blocks (not in `components.index.json`)

These modules live under `src/components` but are **not** re-exported from `src/index.ts`. They explain **how public composites behave** when you read source or debug flows. They are **not** part of the machine catalog: do not treat their APIs as stable public contracts unless the package starts exporting them.

**Source order:** still prefer `components.index.json` → `ai/components/<Name>.md` for public components. Open this file when you need **why** `ConversationItem`, `ConversationInfo`, `UserProfile`, `VideoView`, `OtherUserProfile`, or `DynamicAvatar` behave a certain way.

---

## `WrapperRoot`

**Paths:** `src/components/elements/WrapperRoot/WrapperRoot.tsx`, `WrapperRoot.types.ts`

**Role:** Polymorphic root (`as` defaults to `div`) that forwards DOM props and optionally **Motion** props (`motion/react-m`). Props whose names match `MOTION_PROPS` are passed to the motion element; the rest go to the host element.

**Behavior variants:**

| State | What renders |
| ----- | ------------ |
| `loading === false` (default) | `children` |
| `loading === true`, no `skeleton` | `OvalLoader` (with optional `loaderClassName`) |
| `loading === true`, `skeleton` set | custom `skeleton` node |
| Motion props present, tag has motion counterpart | `MotionTag` with DOM + motion props |
| Motion props present, tag has no motion mapping | plain `createElement(tag)` (motion props dropped for that tag) |

Many public props types extend `Omit<WrapperRootProps<...>, "as" | "children">` so consumers get `className`, `onClick`, `data-*`, etc. **Individual composites may ignore** some of those fields in their implementation (see e.g. `Modal` spec).

---

## `LastMessage` and `LastMessageMedia`

**Paths:** `src/components/elements/LastMessage/LastMessage.tsx`, `LastMessageMedia.tsx`, `LastMessage.types.ts`

**Used by:** `ConversationItem` (list row subtitle / status area).

**Adapters:** `getAdapters()` → `mediaUtils`, `userUtils`, `useParticipants` (`getCurrentUser`, `getUserById`).

**`LastMessage` branches:**

1. **Nothing to show:** if there is no `message` and no draft text / reply id → returns `null`.
2. **Draft row:** if draft has `dText` or `dRepliedMid` **and** `countOfUnreadMessages < 1` → shows “Draft:” strip (with reply icon when `dRepliedMid`), not the normal last-message layout.
3. **Otherwise:** row with optional author label (`isShowUserName`), optional **`LastMessageMedia`** for the **last** attachment only, ellipsized text from `body` or derived file-type label via `mediaUtils.getFileType`.
4. **Trailing column:** unread badge if `countOfUnreadMessages > 0`; else if the author is the current user, **`MessageStatus`** with `color="accent"`; else nothing.

**`LastMessageMedia`:** small thumb — BlurHash if `attachment.file_blur_hash`, else icon (Image/Video) from `file_content_type` or explicit `fileType` prop; icon color depends on `isSelected`.

---

## `ConversationInfoAvatar`

**Path:** `src/components/elements/ConversationInfoAvatar/ConversationInfoAvatar.tsx`

**Used by:** `ConversationInfo`, `EditModalContainer` (`ConversationInputsGroup`).

**Adapters:** `useConversations().updateChatImage`.

**Behavior:** `WrapperRoot` wraps `DynamicAvatar` (group image + blur hash). Hidden file input with `ALLOWED_AVATAR_FORMATS`. Camera FAB opens picker unless `isEditDisabled` — then no edit UI.

---

## `ParticipantInChat`

**Path:** `src/components/elements/ParticipantInChat/ParticipantInChat.tsx`

**Used by:** `ConversationInfo` (participants list).

**Adapters:** `useParticipants`, `userUtils` (`getUserInitials`, `getUserFullName`).

**Behavior:**

- **Click:** calls `onOpenProfile(null)` if the row is the current user, else `onOpenProfile(user._id)`. Still forwards `onClick` from props after that.
- **Context menu:** `preventDefault`, then `onRequestContextMenu` with a fixed menu shape: `participantInfo`; `participantSendMessage` unless current user; `convRemoveParticipants` only if current user is owner **and** row is not self. `externalProps.userObject` is set.

---

## `UserProfileAvatar`

**Path:** `src/components/elements/UserProfileAvatar/UserProfileAvatar.tsx`

**Used by:** `UserProfile`, `EditModalContainer` (`UserInputsGroup`).

**Adapters:** `useParticipants().updateCurrentUserAvatar`.

**Behavior:** Same pattern as `ConversationInfoAvatar`: `DynamicAvatar`, hidden file input, camera FAB. `swapAccentAndMainColor` toggles background token on the inner wrapper.

---

## `PlayButton`

**Path:** `src/components/elements/VideoView/PlayButton.tsx`

**Used by:** `VideoView` only.

**Behavior:** Centered overlay “play” control. **`VideoView`** does not render it when `enableControls` is true or `removePlayButton` is true, or until load state allows (see `VideoView.tsx`).

---

## `AvatarWithFallback`

**Path:** `src/components/elements/DynamicAvatar/AvatarWithFallback.tsx`

**Used by:** `DynamicAvatar` when `avatarUrl` is set.

**Behavior:** Preloads URL with `Image()`. On load → `<img>`; on error or no URL → `fallbackIcon` or default `User` icon. **Async:** content swaps after load/error; not the same as blur-hash path inside `DynamicAvatar`.

---

## `OtherUserProfileViewCard` / `OtherUserProfileViewCompact`

**Paths:** `src/components/composites/OtherUserProfile/OtherUserProfileViewCard.tsx`, `OtherUserProfileViewCompact.tsx`

**Used by:** `OtherUserProfile` (via `view` / `defaultView`: `"card"` | `"compact"`).

**Behavior:**

- **Card:** scrollable body via `CustomVerticalScrollbar`, close button position depends on `isMobile` (aria “Back” vs “Close”), large avatar, contact fields, optional start conversation.
- **Compact:** horizontal bar with back chevron, smaller avatar layout, same data/actions pattern without the card chrome.

Public API for theming remains **`OtherUserProfile`** props; these files are implementation detail for **layout variants**.

---

## Quick composition map

| Public component | Notable internal pieces |
| ---------------- | ------------------------ |
| `ConversationItem` | `LastMessage`, `TypingLine`, `DynamicAvatar`, `WrapperRoot` |
| `ConversationInfo` | `ConversationInfoAvatar`, `ParticipantInChat`, `CustomVerticalScrollbar`, `WrapperRoot` |
| `UserProfile` | `UserProfileAvatar` |
| `EditModalContainer` | `UserProfileAvatar`, `ConversationInfoAvatar` (via input groups) |
| `VideoView` | `PlayButton`, `MediaBlurHash` |
| `DynamicAvatar` | `AvatarWithFallback`, `ImageLoader`, `WrapperRoot` |
| `OtherUserProfile` | `OtherUserProfileViewCard`, `OtherUserProfileViewCompact`, `WrapperRoot` |

---

## Hooks and utilities (not components)

Also not re-exported as “components” but shape behavior: `setAdapters` / `getAdapters`, `useConfirmWindow`, `useKeyDown`, `useViewportBreakpoints`, and utils under `src/utils`. **Adapter contract and per-component usage:** [`ADAPTERS.md`](./ADAPTERS.md). Raw typings: `src/adapters/types.ts`.
