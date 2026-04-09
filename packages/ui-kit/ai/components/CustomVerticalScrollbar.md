# CustomVerticalScrollbar

## Description

Custom track + thumb over a scrollable **`children`** region; optional **scroll-to-bottom** button, debounced **`onScrollStop`** for persistence, optional **`localStorage`** restore/save for `scroll_pos_${containerId|customId}` when **`persistScrollPosition`** is not `false`. Supports **`autoHeight`** + **`autoHeightMax`**.

**Source:** `src/components/composites/CustomVerticalScrollbar/CustomVerticalScrollbar.tsx`, `CustomVerticalScrollbar.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `children` | `ReactNode` | Yes | — | Scrollable content. |
| `containerRef` | `RefObject<HTMLDivElement \| null>` | No | — | External ref to viewport; internal ref if omitted. |
| `onScroll` | `(scrollFromBottom: number) => void` | No | — | Fires on scroll. |
| `onScrollStop` | `(scrollTop: number) => void` | No | — | Debounced end of scroll. |
| `isScrollToBottomVisible` | `boolean` | No | — | Show jump-to-bottom control. |
| `onScrollToBottom` | `() => void` | No | — | Jump button handler. |
| `minThumbHeight` | `number` | No | — | Thumb minimum height (px). |
| `autoHideDelay` | `number` | No | — | Hide delay after scroll (ms). |
| `hoverShowDelay` | `number` | No | — | Track-hover visibility (ms). |
| `persistScrollPosition` | `boolean` | No | — | `false` disables `localStorage` read/write. |
| `containerId` | `string` | No | — | Storage key `scroll_pos_${id}`. |
| `customId` | `string` | No | — | Alias of `containerId`. |
| `className` | `string` | No | — | Outer wrapper. |
| `contentClassName` | `string` | No | — | Scrollable area. |
| `customClassName` | `string` | No | — | Alias of `className`. |
| `childrenClassName` | `string` | No | — | Alias of `contentClassName`. |
| `customStyle` | `CSSProperties` | No | — | Outer wrapper style. |
| `autoHeight` | `boolean` | No | — | Use `autoHeightMax` for outer max height. |
| `autoHeightMax` | `number \| string` | No | — | Max height when `autoHeight`. |

## Rules

### Required

- `children`.

### Preferred

- Set exactly one id source (`containerId` or `customId`) when using persistence.

## Examples

### Basic

```tsx
<CustomVerticalScrollbar containerId="thread" className="ui:flex-1 ui:min-h-0">
  {messageNodes}
</CustomVerticalScrollbar>
```

## Anti-patterns

- Conflicting `containerId` and `customId` — behaviour depends on implementation (prefer one).
