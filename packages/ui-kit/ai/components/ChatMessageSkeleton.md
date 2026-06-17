# ChatMessageSkeleton

## Description

Placeholder row matching **chat message** layout: circular avatar skeleton + rectangular bubble. **`bubbleWidth`** default **280**. **`aria-hidden`**.

**Source:** `src/skeletons/ChatMessageSkeleton.tsx`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `bubbleWidth` | `number` | No | `280` | Bubble skeleton width. |
| `className` | `string` | No | `""` | Wrapper. |

## Examples

```tsx
<ChatMessageSkeleton bubbleWidth={320} />
```

## Anti-patterns

- None specific.
