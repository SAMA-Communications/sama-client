# DotsLoader

## Description

Thin wrapper around `react-loader-spinner` **ThreeDots** for inline loading (`ariaLabel="three-dots-loading"`). No `WrapperRoot`; sizing and color are props.

**Source:** `src/components/elements/DotsLoader/DotsLoader.tsx`, `DotsLoader.types.tsx`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `wrapperClassName` | `string` | No | `""` | Passed to spinner `wrapperClass`. |
| `mainColor` | `string` | No | `var(--color-accent-500)` | Dot color. |
| `width` | `number` | No | `16` | Spinner width. |
| `height` | `number` | No | `22` | Spinner height. |

## Rules

### Preferred

- Use for compact inline loading; use `OvalLoader` for larger centered states (e.g. modals).

## Examples

### Basic

```tsx
<DotsLoader />
```

### Custom size

```tsx
<DotsLoader width={24} height={32} mainColor="#333" wrapperClassName="ui:mx-auto" />
```

## Anti-patterns

- Relying on this for full-page loading without a layout wrapper — it has no full-bleed styling.
