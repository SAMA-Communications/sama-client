# MessageUserIcon

## Description

**Avatar** for **`User`** (or null): **`isCurrentUser`** picks **`fallbackCurrentUser`** vs **`fallbackOtherUser`**, optional **`size`**. **`WrapperRoot`** `div`.

**Source:** `src/components/elements/MessageUserIcon/MessageUserIcon.tsx`, `MessageUserIcon.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `user` | `User \| null \| undefined` | Yes | Wire user or empty. |
| `isCurrentUser` | `boolean` | No | Fallback set selection. |
| `size` | `number` | No | Pixel size. |
| `fallbackCurrentUser` | `ReactNode` | No | When current user and no avatar. |
| `fallbackOtherUser` | `ReactNode` | No | When other user and no avatar. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Examples

```tsx
<MessageUserIcon user={sender} isCurrentUser={false} size={46} fallbackOtherUser={<UserRound />} />
```

## Anti-patterns

- None specific.
