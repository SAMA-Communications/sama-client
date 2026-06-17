# ImageLoader

## Description

Small **blur-hash → image** transition helper; **`blurHash`**, optional **`isShowLoader`**. Used inside **`DynamicAvatar`** and similar. No `WrapperRoot` on props type.

**Source:** `src/components/elements/ImageLoader/ImageLoader.tsx`, `ImageLoader.types.tsx`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `blurHash` | `string` | No | BlurHash string. |
| `isShowLoader` | `boolean` | No | Show loading chrome. |

## Rules

### Preferred

- Compose via **`DynamicAvatar`** / **`MediaBlurHash`** unless you need the primitive.

## Examples

```tsx
<ImageLoader blurHash={hash} isShowLoader />
```

## Anti-patterns

- Expecting full img props here — this type is minimal; see parent components.
