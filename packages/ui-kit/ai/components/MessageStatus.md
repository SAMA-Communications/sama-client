# MessageStatus

## Description

Small **span** row showing delivery icon: `Check` (sent), `CheckCheck` (read), `Clock` (default / pending). Pass either `status` or full `message` (uses `message.status`). Renders **null** if neither `message` nor `status` is provided. `WrapperRoot as="span"`.

**Source:** `src/components/elements/MessageStatus/MessageStatus.tsx`, `MessageStatus.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `status` | `"sent" \| "read"` | No | — | Direct status; takes precedence path with `message`. |
| `message` | `Message` | No | — | Uses `message.status` when `status` omitted; other statuses map via `ICONS` fallback to clock. |
| `color` | `"accent" \| "white"` | No | `"accent"` | Icon color. |
| `className` | `string` | No | — | On `WrapperRoot` span. |
| *(extends)* | `Omit<WrapperRootProps<"span">, "as" \| "children">` | — | — | `as` is `"span"` inside component. |

## Rules

### Preferred

- Prefer explicit `status` when you only need sent/read ticks without a full `Message` object.

## Examples

### Basic

```tsx
<MessageStatus status="read" color="accent" />
```

### From message

```tsx
<MessageStatus message={msg} />
```

## Anti-patterns

- Passing neither `status` nor `message` — renders nothing (`null`).
