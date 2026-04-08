# UserAvatar

## Description

**Avatar** image or **`defaultIcon`**: **`avatarUrl`**, **`avatarBlurHash`**, **`width`**, **`height`**, **`alt`**, **`wrapperClassName`** (legacy). **`WrapperRoot`** `div`.

**Source:** `src/components/elements/UserAvatar/UserAvatar.tsx`, `UserAvatar.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `avatarUrl` | `string` | No | Image URL. |
| `avatarBlurHash` | `string` | No | Placeholder. |
| `defaultIcon` | `ReactNode` | No | Fallback. |
| `wrapperClassName` | `string` | No | Legacy wrapper class. |
| `height` | `number` | No | Size. |
| `width` | `number` | No | Size. |
| `alt` | `string` | No | Alt text. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Examples

```tsx
<UserAvatar avatarUrl={u.avatar_url} avatarBlurHash={u.avatar_blur_hash} width={40} height={40} alt="" />
```

## Anti-patterns

- None specific.
