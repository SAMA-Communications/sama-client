# UserSelectorBlock

## Description

Chrome for **create chat / add participants**: selected users summary, **`searchInputSlot`**, **`searchResultsSlot`** (typically `SearchInput` + `SearchBlock`), **Create/Add** submit, **Close**. Enforces **`maxCount`** (default **50**). **`isSearchExpanded`** animates search area height (~60dvh) when user types. **`initSelectedUsers`** are pre-picked and excluded from “to add” count logic.

**Source:** `src/components/composites/UserSelectorBlock/UserSelectorBlock.tsx`, `UserSelectorBlock.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `selectedUsers` | `User[]` | Yes | Controlled selection (mirror `SearchBlock`). |
| `onAddUser` | `(user: User) => void` | Yes | Add to selection. |
| `onRemoveUser` | `(user: User) => void` | Yes | Remove from selection. |
| `initSelectedUsers` | `User[]` | No | Already in chat; not counted toward add cap UX. |
| `onClose` | `() => void` | Yes | Dismiss sheet. |
| `onCreate` | `(users: User[]) => void \| Promise<void>` | Yes | Submit final list. |
| `searchInputSlot` | `ReactNode` | Yes | Search field region. |
| `searchResultsSlot` | `ReactNode` | Yes | Results list region. |
| `isSearchExpanded` | `boolean` | No | Tall search panel when true. |
| `maxCount` | `number` | No | Default 50. |
| `submitLabel` | `"Create" \| "Add"` | No | Button label. |

## Rules

### Required

- All props except optional flags/slots alternatives — slots are required.

### Preferred

- Pass the **same** `selectedUsers` / handlers to **`SearchBlock`** for consistent selection.

## Examples

### Basic

```tsx
<UserSelectorBlock
  selectedUsers={sel}
  onAddUser={add}
  onRemoveUser={remove}
  onClose={close}
  onCreate={submit}
  searchInputSlot={<SearchInput value={q} onChange={setQ} />}
  searchResultsSlot={<SearchBlock {...blockProps} />}
  submitLabel="Create"
/>
```

## Anti-patterns

- Mismatched `selectedUsers` between block and `SearchBlock` — double toggles or stale UI.
