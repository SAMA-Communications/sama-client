# EditModalContainer

## Description

**`Modal`** wrapping either **conversation** fields (`ConversationInputsGroup`) or **user** profile fields (`UserInputsGroup`). Uses **`getAdapters()`** (`useParticipants`, `useConversations`) to **`updateCurrentUserFields`** / **`updateNameAndDescription`** on save. **Enter** key submits via **`useKeyDown`**.

**Source:** `src/components/composites/EditModalContainer/EditModalContainer.tsx`, `EditModalContainer.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `type` | `"conversation" \| "user"` | Yes | Which form set. |
| `onClose` | `() => void` | Yes | Cancel / after save close. |
| `className` | `string` | No | Overlay `className` on **`Modal`**. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | Remaining props spread to **`Modal`**; see **Modal** for runtime behaviour (most `div` props are ignored by `Modal.tsx`). |

## Rules

### Required

- Working **adapters** for the selected `type`.
- `type` and `onClose`.

### Preferred

- Close modal from adapter callbacks after successful save (component calls `onClose` on success path — verify in `EditModalContainer.tsx`).

## Examples

### Basic

```tsx
<EditModalContainer type="user" onClose={() => setOpen(false)} />
```

## Anti-patterns

- Opening without adapter registration — runtime failure.
