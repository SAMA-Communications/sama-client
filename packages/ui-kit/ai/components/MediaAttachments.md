# MediaAttachments

## Description

Grid/list of **`MediaAttachment`** tiles from **`MediaAttachmentData[]`**: optional remove, per-item context menu, open-media callback, size caps. Extends **`WrapperRoot`** `div` with custom **`onContextMenu`** signature (not the native div one).

**Source:** `src/components/composites/MediaAttachments/MediaAttachments.tsx`, `MediaAttachments.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `attachments` | `MediaAttachmentData[]` | Yes | — | Files to render. |
| `mid` | `string` | No | — | Optional message id (styling / data). |
| `maxWidth` | `number \| string \| null` | No | — | Layout constraint. |
| `maxHeight` | `number \| string \| null` | No | — | Layout constraint. |
| `removeFileFunc` | `(index: number) => void` | No | — | Delete control per file. |
| `disableAnimation` | `boolean` | No | — | Skip motion when true. |
| `onContextMenu` | `(e: React.MouseEvent, attachment: MediaAttachmentData) => void` | No | — | Per-attachment menu. |
| `onOpenMedia` | `(index: number) => void` | No | — | Open viewer / lightbox. |
| `className` | `string` | No | — | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children" \| "onContextMenu">` | — | — | Typed `onContextMenu` above. |

## Rules

### Required

- `attachments` (may be empty array).

## Examples

### Basic

```tsx
<MediaAttachments attachments={files} onOpenMedia={(i) => openViewer(i)} removeFileFunc={removeAt} />
```

## Anti-patterns

- Assuming native `onContextMenu` typing — use the two-argument handler from props.
