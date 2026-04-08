# MessageListSkeleton

## Description

Scroll container with **`count`** **`ChatMessageSkeleton`** rows (default **6**), staggered **`bubbleWidth`**. Optional **`scrollContainerId`** on the outer div for scroll restore hooks.

**Source:** `src/skeletons/MessageListSkeleton.tsx`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `count` | `number` | No | `6` | Message placeholders. |
| `className` | `string` | No | `""` | Scroll container classes. |
| `scrollContainerId` | `string` | No | — | `id` on scroll root. |

## Examples

```tsx
<MessageListSkeleton count={10} scrollContainerId="msg-list-skel" />
```

## Anti-patterns

- None specific.
