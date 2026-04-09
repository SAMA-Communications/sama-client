# ConversationItem

## Description

One row in a conversation list: **`Conversation`** summary, **`isSelected`** highlight. Typically used inside **`ConversationItemList`**.

**Source:** `src/components/elements/ConversationItem/ConversationItem.tsx`, `ConversationItem.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `conversation` | `Conversation` | Yes | — | Wire conversation model. |
| `isSelected` | `boolean` | Yes | — | Active row styling. |
| `className` | `string` | No | — | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | `WrapperRoot` + rest. |

## Rules

### Required

- `conversation`, `isSelected`.

## Examples

### Basic

```tsx
<ConversationItem conversation={c} isSelected={c._id === activeId} />
```

## Anti-patterns

- Treating as controlled selection by itself — parent list owns `isSelected` per row.
