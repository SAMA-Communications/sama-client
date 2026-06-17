# UserInfo

## Description

Compact **participant** row: **`user`** summary + **`onRemove`** control. **`WrapperRoot`** `div`.

**Source:** `src/components/elements/UserInfo/UserInfo.tsx`, `UserInfo.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `user` | `User` | Yes | Participant. |
| `onRemove` | `() => void` | Yes | Remove / leave action. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Rules

### Required

- `user`, `onRemove`.

## Examples

```tsx
<UserInfo user={p} onRemove={() => removeParticipant(p._id)} />
```

## Anti-patterns

- None specific.
