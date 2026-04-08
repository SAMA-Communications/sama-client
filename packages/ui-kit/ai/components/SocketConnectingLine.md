# SocketConnectingLine

## Description

**Connecting…** banner; **hidden** when **`isSocketConnected`** is true. Optional **`message`** copy.

**Source:** `src/components/elements/SocketConnectingLine/SocketConnectingLine.tsx`, `SocketConnectingLine.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `isSocketConnected` | `boolean` | Yes | When true, line not shown. |
| `message` | `string` | No | Connecting text. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Rules

### Required

- `isSocketConnected`.

## Examples

```tsx
<SocketConnectingLine isSocketConnected={socket.readyState === 1} message="Connecting…" />
```

## Anti-patterns

- Inverting **`isSocketConnected`** — component hides when connected.
