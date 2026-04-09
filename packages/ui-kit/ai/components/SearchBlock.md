# SearchBlock

## Description

Search results UI: **users** (`SearchedUser`) and/or **conversations** (`SearchConversationList`) inside **`CustomVerticalScrollbar`**. Data either from **props** (`searchedUsers`, `searchedChats`, `defaultChats`) or from **`getAdapters().getSearchBlockData()`** when `searchText` + `searchOptions` are passed and the adapter hook exists. **`onAddUser` / `onRemoveUser`** merge with aliases **`addUserToArray` / `removeUserFromArray`**.

**Source:** `src/components/composites/SearchBlock/SearchBlock.tsx`, `SearchBlock.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `searchText` | `string \| null \| undefined` | No | With `searchOptions`, enables adapter-driven data. |
| `searchOptions` | `SearchBlockDataOptions` | No | `isSearchOnlyUsers`, `isShowDefaultConvs`. |
| `searchedUsers` | `User[]` | No | Required when adapter path not used. |
| `searchedChats` | `Conversation[]` | No | When not user-only search. |
| `defaultChats` | `Conversation[]` | No | Shown when not searching (if `isShowDefaultConvs`). |
| `isShowDefaultConvs` | `boolean` | Yes | Show default conversation list. |
| `isSearchOnlyUsers` | `boolean` | Yes | Hide chat section. |
| `isUserSearched` | `string \| null \| undefined` | No | Empty-state copy for users. |
| `isChatSearched` | `string \| null \| undefined` | No | Empty-state copy for chats. |
| `isPending` | `boolean` | No | Adapter loading path. |
| `selectedUsers` | `User[]` | Yes | Chips / selection state. |
| `onAddUser` | `(user: User) => void` | No | Select user (or use `addUserToArray`). |
| `onRemoveUser` | `(user: User) => void` | No | Deselect (or `removeUserFromArray`). |
| `addUserToArray` | `(user: User) => void` | No | Alias of `onAddUser`. |
| `removeUserFromArray` | `(user: User) => void` | No | Alias of `onRemoveUser`. |
| `isClickDisabledFunc` | `(user: User) => boolean` | No | Disable row interaction. |
| `isMaxLimit` | `boolean` | Yes | At participant cap. |
| `onClearInputText` | `() => void` | No | Clear search field callback. |
| `isClearInputText` | `boolean` | No | Trigger clear UX. |
| `onConversationClick` | `(cid: string) => void` | No | Conversation row. |
| `onUserClick` | `(user: User) => void` | No | When `isSelectUserToArray` is false. |
| `isSelectUserToArray` | `boolean` | Yes | true = toggle selection; false = `onUserClick`. |
| `selectedConversationId` | `string \| null \| undefined` | No | Highlight in chat list. |
| `customClassName` | `string` | No | Root wrapper. |

## Rules

### Required

- `isShowDefaultConvs`, `isSearchOnlyUsers`, `selectedUsers`, `isMaxLimit`, `isSelectUserToArray`.
- Either supply lists explicitly **or** adapter `getSearchBlockData` + `searchText` / `searchOptions`.

### Preferred

- Keep `selectedUsers` in sync with `UserSelectorBlock` / parent when using multi-select.

## Examples

### With explicit data

```tsx
<SearchBlock
  searchedUsers={users}
  searchedChats={chats}
  defaultChats={recents}
  isShowDefaultConvs
  isSearchOnlyUsers={false}
  selectedUsers={picked}
  onAddUser={add}
  onRemoveUser={remove}
  isMaxLimit={picked.length >= 50}
  isSelectUserToArray
  onConversationClick={openChat}
/>
```

## Anti-patterns

- Adapter mode without registering `getSearchBlockData` — falls back to empty constants.
