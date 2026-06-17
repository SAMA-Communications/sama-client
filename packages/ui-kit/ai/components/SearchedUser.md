# SearchedUser

## Description

**User** row in search results: **`user`**, **`isSelected`**, **`isClickDisabled`**, **`onClick`**. Used inside **`SearchBlock`**.

**Source:** `src/components/elements/SearchedUser/SearchedUser.tsx`, `SearchedUser.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `user` | `User` | Yes | Row data. |
| `isSelected` | `boolean` | No | Chip / highlight. |
| `isClickDisabled` | `boolean` | No | Blocks **`onClick`**. |
| `onClick` | `() => void` | Yes | Row activation. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Rules

### Required

- `user`, `onClick`.

## Examples

```tsx
<SearchedUser user={u} isSelected={picked} onClick={() => toggle(u)} isClickDisabled={atLimit} />
```

## Anti-patterns

- None specific.
