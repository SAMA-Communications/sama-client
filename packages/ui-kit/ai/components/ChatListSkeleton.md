# ChatListSkeleton

## Description

Repeats **`ConversationItemSkeleton`** **`count`** times (default **8**). **`aria-hidden`**.

**Source:** `src/skeletons/ChatListSkeleton.tsx`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `count` | `number` | No | `8` | Number of row skeletons. |
| `className` | `string` | No | `""` | Wrapper. |

## Examples

```tsx
<ChatListSkeleton count={12} className="ui:divide-y" />
```

## Anti-patterns

- None specific.
