# OvalLoader

## Description

Oval **SVG-style** loading indicator; **`width`**, **`height`**, **`color`**, **`wrapperClassName`** (legacy alias). Root is **`WrapperRoot`** `div`.

**Source:** `src/components/elements/OvalLoader/OvalLoader.tsx`, `OvalLoader.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `width` | `number` | No | — | Spinner width (px). |
| `height` | `number` | No | — | Spinner height (px). |
| `color` | `string` | No | — | Stroke color. |
| `wrapperClassName` | `string` | No | — | Legacy; prefer `className` when possible. |
| `className` | `string` | No | — | Root `WrapperRoot`. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | `loading`, `skeleton`, etc. |

## Rules

### Preferred

- Use inside modals or empty states; pair with **`DotsLoader`** for inline micro loading.

## Examples

### Basic

```tsx
<OvalLoader width={80} height={80} wrapperClassName="ui:self-center" />
```

## Anti-patterns

- None specific; props are purely presentational.
