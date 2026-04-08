# VideoView

## Description

**Video** tile from **`VideoData`**: **`file_url`**, blur hash, optional **`onClick`**, **`isFullSize`**, **`removePlayButton`**, **`enableControls`**, **`mediaBlurHashProps`**.

**Source:** `src/components/elements/VideoView/VideoView.tsx`, `VideoView.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `video` | `VideoData` | No | Payload. |
| `onClick` | `() => void` | No | Click (e.g. open viewer). |
| `isFullSize` | `boolean` | No | Layout. |
| `removePlayButton` | `boolean` | No | Hide play overlay. |
| `enableControls` | `boolean` | No | Native controls. |
| `mediaBlurHashProps` | `Partial<MediaBlurHashProps>` | No | Blur/loader. |

### `VideoData`

`file_name?`, `file_url?`, `file_blur_hash?`.

## Examples

```tsx
<VideoView video={{ file_url: url }} onClick={play} enableControls />
```

## Anti-patterns

- None specific.
