# ContextMenu

## Description

Absolutely positioned menu panel (`left`/`top` from `position`), `role="menu"`. Renders **`children`** inside `WrapperRoot` as `div`. Typically contains `ContextMenuItem` nodes.

**Source:** `src/components/composites/ContextMenu/ContextMenu.tsx`, `ContextMenu.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `position` | `{ x: number; y: number }` | Yes | — | Pixel coordinates for `style.left` / `style.top`. |
| `children` | `ReactNode` | Yes | — | Menu body (not `WrapperRoot`’s omitted slot — re-added on props interface). |
| `className` | `string` | No | `""` | Merged with base menu classes. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` + `children` | — | — | Standard `style` merges after position. Also `loading`, `skeleton`, etc. from `WrapperRoot`. |

## Rules

### Required

- `position` and `children`.

### Preferred

- Close on outside click / escape in the **parent** — this component does not handle dismissal.

## Examples

### Basic

```tsx
<ContextMenu position={{ x: clientX, y: clientY }} onMouseLeave={close}>
  <ContextMenuItem label="Copy" onClick={copy} />
</ContextMenu>
```

## Anti-patterns

- Forgetting viewport/clamping — raw `x`/`y` can place the menu off-screen.
