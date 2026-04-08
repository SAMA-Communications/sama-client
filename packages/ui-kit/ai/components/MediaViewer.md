# MediaViewer

## Description

Full-screen / overlay viewer for **`MediaAttachmentData[]`**: current index, prev/next via **`onIndexChange`**, **`onClose`**. Optional **`getFileType`** override, **`isMobile`** UI (close + overlay tap), **`swipeRef`** for touch area.

**Source:** `src/components/composites/MediaViewer/MediaViewer.tsx`, `MediaViewer.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `attachments` | `MediaAttachmentData[]` | Yes | — | Items to browse. |
| `currentIndex` | `number` | Yes | — | Active slide (0-based). |
| `onIndexChange` | `(index: number) => void` | Yes | — | User changed slide. |
| `onClose` | `() => void` | Yes | — | Dismiss viewer. |
| `getFileType` | `(fileName?, fileContentType?) => string \| null` | No | — | Returns e.g. `"Image"` / `"Video"` or null. |
| `isMobile` | `boolean` | No | — | Mobile chrome and overlay close. |
| `swipeRef` | `RefObject<HTMLDivElement \| null>` | No | — | Touch swipe region. |
| `className` | `string` | No | — | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | `WrapperRoot` + rest. |

## Rules

### Required

- `attachments`, `currentIndex`, `onIndexChange`, `onClose`.

### Preferred

- Clamp `currentIndex` in the parent to `[0, attachments.length - 1]`.

## Examples

### Basic

```tsx
<MediaViewer
  attachments={items}
  currentIndex={idx}
  onIndexChange={setIdx}
  onClose={() => setOpen(false)}
  isMobile={isPhone}
/>
```

## Anti-patterns

- Empty `attachments` with `currentIndex > 0` — verify bounds in parent.
