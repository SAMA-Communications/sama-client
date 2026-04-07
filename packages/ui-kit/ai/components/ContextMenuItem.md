# ContextMenuItem

## Description

Single row for **`ContextMenu`**: **`text`**, optional **`icon`**, **`onClick`**, optional danger styling, optional **`additionalContent`**. **`uId`** / **`uObject`** are app metadata — **not** forwarded to the DOM.

**Source:** `src/components/elements/ContextMenuItem/ContextMenuItem.tsx`, `ContextMenuItem.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `text` | `string` | Yes | — | Primary label. |
| `icon` | `ReactNode` | No | — | Leading icon. |
| `onClick` | `() => void` | Yes | — | Row activation. |
| `isDangerStyle` | `boolean` | No | — | Red / destructive emphasis. |
| `id` | `string` | No | — | Optional list key hint. |
| `uId` | `string` | No | — | App-only; not a DOM id. |
| `uObject` | `unknown` | No | — | App-only payload. |
| `additionalContent` | `ReactNode` | No | — | Trailing / extra slot. |
| `className` | `string` | No | — | Row root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | `WrapperRoot` row. |

## Rules

### Required

- `text`, `onClick`.

## Examples

### Basic

```tsx
<ContextMenuItem text="Copy" icon={<Copy size={18} />} onClick={copy} />
```

### Danger

```tsx
<ContextMenuItem text="Delete" isDangerStyle onClick={del} uId={messageId} />
```

## Anti-patterns

- Expecting **`uId`** to set HTML `id` — it does not; use `id` if you need a DOM id (verify implementation if added later).
