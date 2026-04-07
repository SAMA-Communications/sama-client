# AdditionalMessages

## Description

Compact strip for **reply**, **edit**, or **forward** context above a message: icon, title line, body/counter line, optional attachment thumbnail, optional close (X). Uses `WrapperRoot` as `div`. If `message` (or first of `messages`) has `error`, renders **null**.

**Source:** `src/components/composites/AdditionalMessages/AdditionalMessages.tsx`, `AdditionalMessages.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `type` | `AdditionalMessagesType` | Yes | — | `"reply"` \| `"edit"` \| `"forward"`. |
| `message` | `AdditionalMessagesMessage \| null \| undefined` | No | — | Single message; for forward, first item or use `messages` for count. |
| `messages` | `unknown[]` | No | `[]` | Forward: length drives “N forwarded messages” when length ≥ 2. |
| `isPreview` | `boolean` | No | `false` | Card-style preview vs inline strip above bubble. |
| `color` | `"accent" \| "white"` | No | `"accent"` | Background/text/icon treatment. |
| `onCloseFunc` | `() => void` | No | — | Shows X; `stopPropagation` on click. |
| `onClickFunc` | `() => void` | No | — | Entire root `onClick`; adds cursor when set (non-preview). |
| `senderName` | `string` | No | `""` | Title: e.g. “Reply to …” when preview+reply. |
| `attachmentSlot` | `ReactNode` | No | — | Shown only if `attachments?.length` and slot provided. |
| `className` | `string` | No | — | Merged on root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | `loading`, `skeleton`, `loaderClassName`, `div` + motion props. |

### `AdditionalMessagesMessage`

| Field | Type | Description |
| ----- | ---- | ----------- |
| `body` | `string \| undefined` | Second line for reply/single forward. |
| `attachments` | `unknown[] \| undefined` | If length & attachmentSlot, shows thumb. |
| `from` | `string \| undefined` | Not displayed directly in current UI. |
| `error` | `string \| undefined` | If truthy, whole component returns `null`. |

## Rules

### Required

- `type` must be one of `"reply"`, `"edit"`, `"forward"`.

### Forbidden

- Do not pass `as` or `children` through the public shape; `children` is omitted from `WrapperRoot` extension.

### Preferred

- For `ChatMessage` reply strip, use `type="reply"` with `onClickFunc` / `senderName` as needed.
- Avoid relying on `message.from` for UI — it is unused in the current implementation.

## Examples

### Basic (reply strip)

```tsx
<AdditionalMessages
  type="reply"
  color="accent"
  message={{ body: quotedBody }}
  senderName={authorName}
  onClickFunc={() => focusReply()}
/>
```

### Forward count

```tsx
<AdditionalMessages type="forward" messages={forwardedList} color="white" />
```

## Anti-patterns

- Passing `message` with `error` set and expecting visible UI — component returns `null`.
- Using `type="forward"` with `messages.length < 2` without `body` on `message` — second line may be empty.
