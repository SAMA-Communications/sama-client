# MediaBlurHash

## Description

**BlurHash** canvas / placeholder with **`status`** (`loading` \| `error` \| `success`), optional **loader** colours and **`loaderSize`**.

**Source:** `src/components/elements/MediaBlurHash/MediaBlurHash.tsx`, `MediaBlurHash.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `status` | `MediaStatus` | No | `"loading"` \| `"error"` \| `"success"`. |
| `blurHash` | `string` | No | BlurHash string. |
| `loaderColor` | `string` | No | Primary loader colour. |
| `loaderSecondaryColor` | `string` | No | Secondary loader colour. |
| `loaderSize` | `number` | No | Loader dimensions. |

## Examples

```tsx
<MediaBlurHash blurHash={h} status="success" />
```

## Anti-patterns

- None specific.
