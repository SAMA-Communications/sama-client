# InformativeMessage

## Description

System / info **message** strip: **`text`**, optional **`onClick`**, **`isNextMessageUsers`** adds bottom margin for list spacing.

**Source:** `src/components/elements/InformativeMessage/InformativeMessage.tsx`, `InformativeMessage.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `text` | `string` | Yes | Message copy. |
| `onClick` | `() => void` | No | Activates row. |
| `isNextMessageUsers` | `boolean` | No | Extra `mb` when next is user message. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Rules

### Required

- `text`.

## Examples

```tsx
<InformativeMessage text="You joined this chat" isNextMessageUsers />
```

## Anti-patterns

- None specific.
