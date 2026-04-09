# MediaAttachment

## Description

Single **attachment tile** in a grid: **`attachment`** (`MediaAttachmentData`), **`index`**, **`flexGrow`** for row layout, optional **`onClick`**, **`onContextMenu`**, **`removeFileFunc`**, **`disableAnimation`**.

**Source:** `src/components/elements/MediaAttachment/MediaAttachment.tsx`, `MediaAttachment.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `index` | `number` | Yes | Position in list. |
| `attachment` | `MediaAttachmentData` | Yes | File metadata. |
| `flexGrow` | `number` | Yes | Flex grow for width share. |
| `onClick` | `() => void` | No | Open / preview. |
| `onContextMenu` | `(e: MouseEvent) => void` | No | Context menu. |
| `removeFileFunc` | `(index: number) => void` | No | Remove control. |
| `disableAnimation` | `boolean` | No | Motion off. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

### `MediaAttachmentData`

Exported from the same types file: `file_id`, `file_name`, `file_url`, `file_blur_hash`, `file_content_type`, dimensions, etc.

## Examples

```tsx
<MediaAttachment index={i} attachment={f} flexGrow={1} onClick={() => open(i)} removeFileFunc={remove} />
```

## Anti-patterns

- Mismatched **`index`** vs **`removeFileFunc(index)`** — wrong file removed.
