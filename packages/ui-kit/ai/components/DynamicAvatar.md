# DynamicAvatar

## Description

Avatar with **URL** or **blur hash** via **`ImageLoader`**, optional **`defaultIcon`**, **`generateSoftPastelGradient`-style** fallback from **`bgColorKey`**, configurable **`size`**.

**Source:** `src/components/elements/DynamicAvatar/DynamicAvatar.tsx`, `DynamicAvatar.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `customClassName` | `string` | No | Extra root classes. |
| `size` | `number` | No | Pixel size. |
| `avatarUrl` | `string` | No | Image src. |
| `avatarBlurHash` | `string` | No | Placeholder hash. |
| `defaultIcon` | `ReactNode` | No | Fallback when no image. |
| `altText` | `string` | No | Alt text. |
| `bgColorKey` | `string` | No | Gradient seed. |
| `imageLoaderProps` | `Partial<ImageLoaderProps>` | No | Forwarded to inner loader. |
| `className` | `string` | No | `WrapperRoot`. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Rules

### Preferred

- Provide **`altText`** when `avatarUrl` is user-generated.

## Examples

```tsx
<DynamicAvatar avatarUrl={url} avatarBlurHash={hash} size={40} bgColorKey={userId} />
```

## Anti-patterns

- None specific.
