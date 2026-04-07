# MessageLinkPreview

## Description

Link or **document** preview card from **`UrlPreviewData`**: refresh control, **`color`** (`white` \| `accent`), optional **document** row (file name + **`formattedFileSize`**), **`expandDirection`** (`up` \| `down`) for layout vs bubble.

**Source:** `src/components/elements/MessageLinkPreview/MessageLinkPreview.tsx`, `MessageLinkPreview.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `urlData` | `UrlPreviewData \| null \| undefined` | No | Preview payload; null hides or empty state per implementation. |
| `color` | `"white" \| "accent"` | No | Theme. |
| `onRefresh` | `(e: MouseEvent, url: string) => void` | Yes | Reload metadata. |
| `isDocument` | `boolean` | No | File-style layout. |
| `formattedFileSize` | `string` | No | Shown when `isDocument`. |
| `expandDirection` | `"up" \| "down"` | No | Default from **`PREVIEW_EXPAND_DIRECTION`** constant. |

### `UrlPreviewData`

`url`, optional `title`, `siteName`, `description`, `images[]`, `favicons[]`, `file_name`, `size`.

## Rules

### Required

- `onRefresh`.

## Examples

### Basic

```tsx
<MessageLinkPreview urlData={preview} color="accent" onRefresh={(_, u) => refetch(u)} />
```

## Anti-patterns

- Omitting **`formattedFileSize`** for document mode — size row may look empty.
