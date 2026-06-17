# ImageView

## Description

**Image** tile from **`ImageData`** (`file_url`, `file_blur_hash`, …): optional **`onClick`**, **`isFullSize`** layout, **`mediaBlurHashProps`** override.

**Source:** `src/components/elements/ImageView/ImageView.tsx`, `ImageView.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `image` | `ImageData` | No | Payload. |
| `onClick` | `() => void` | No | Click handler. |
| `isFullSize` | `boolean` | No | Layout variant. |
| `mediaBlurHashProps` | `Partial<MediaBlurHashProps>` | No | Blur/loader tuning. |

### `ImageData`

`file_name?`, `file_url?`, `file_blur_hash?`.

## Examples

```tsx
<ImageView image={{ file_url: url, file_blur_hash: h }} onClick={open} isFullSize />
```

## Anti-patterns

- None specific.
