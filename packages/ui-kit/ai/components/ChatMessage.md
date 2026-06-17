# ChatMessage

## Description

One chat message row: selection UI, avatars, forwarded/reply chrome, bubble (body, optional attachments / link preview), footer for edited time and read/sent status. On mobile (`isMobile`), supports horizontal drag and swipe-to-reply.

**Source:** `src/components/composites/ChatMessage/ChatMessage.tsx`, `ChatMessage.types.ts`. **Types over docs** if they disagree.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `message` | `ChatMessageMessage` | Yes | — | Wire payload; see table below. |
| `sender` | `User \| null` | Yes | — | Avatar data for `MessageUserIcon`; `null` uses fallbacks. |
| `isCurrentUser` | `boolean` | Yes | — | Right-aligned bubble, accent styling, read ticks when applicable. |
| `bodyContent` | `ReactNode` | Yes | — | Main bubble content (e.g. linkified text). |
| `repliedMessage` | `ChatMessageMessage \| null \| undefined` | No | — | Reply strip via `AdditionalMessages`. |
| `attachmentsNode` | `ReactNode` | No | — | Shown only if `message.attachments` is non-empty. |
| `linkPreviewNode` | `ReactNode` | No | — | Shown only if there are **no** attachments. |
| `onUserProfile` | `(uid: string) => void` | No | — | Name/avatar click uses `message.from`. |
| `onContextMenu` | `(e: React.MouseEvent, copyType: string \| null, externalProps?: Record<string, unknown>) => void` | No | — | Bubble: `copyType` `"Text"` if `message.body` truthy, else `null`. Selection / root: `externalProps` may include `{ message }`. |
| `onSelectClick` | `(() => void) \| null` | No | — | Selection mode: select. |
| `onUnselectClick` | `(() => void) \| null` | No | — | Selection mode: unselect. |
| `onReplyClick` | `() => void` | No | — | Reply preview interaction → `AdditionalMessages`. |
| `onVisible` | `(() => void) \| null` | No | — | In `ChatMessageProps` only; **not called** in implementation. |
| `onSwipeReply` | `() => void` | No | — | After left drag past threshold (with `isMobile`). |
| `isMobile` | `boolean` | No | `false` | Drag-x, `whileTap` on bubble, swipe-reply. |
| `isSelected` | `boolean` | No | `false` | Checkbox + bubble highlight. |
| `isSelectionMode` | `boolean` | No | `false` | Checkbox column; root click toggles selection. |
| `isLongTimeBetweenMessages` | `boolean` | No | `false` | Influences default timestamp row when `showTimestamp` omitted. |
| `isPrevMessageYours` | `boolean` | No | `false` | Default author row hidden when same as previous. |
| `isNextMessageYours` | `boolean` | No | `false` | Bubble grouping / default timestamp when `showTimestamp` omitted. |
| `isBlockStart` | `boolean` | No | — | **Not read** in component; use `showAuthor` / `isPrevMessageYours`. |
| `isBlockEnd` | `boolean` | No | — | End-of-block corners / spacing when set. |
| `showAuthor` | `boolean` | No | — | Overrides default author row (`!isPrevMessageYours`). |
| `showTimestamp` | `boolean` | No | — | Overrides default time row (`isLongTimeBetweenMessages` or `!isNextMessageYours`). |
| `senderDisplayName` | `string` | No | `""` | Empty → shows `"Deleted account"` when author row visible. |
| `repliedMessageSenderName` | `string` | No | `""` | Reply strip label. |
| `swipeReplyThreshold` | `number` | No | `50` | Pixels of left drag to fire `onSwipeReply`. |
| `onBubblePointerDown` | `(e: React.PointerEvent) => void` | No | — | Inner motion bubble. |
| `onBubblePointerUp` | `(e: React.PointerEvent) => void` | No | — | Inner motion bubble. |
| `onBubblePointerLeave` | `(e: React.PointerEvent) => void` | No | — | Inner motion bubble. |
| `onBubbleClick` | `(e: React.MouseEvent) => void` | No | — | Inner motion bubble. |
| `hideUserIcon` | `boolean` | No | `false` | Hides avatar columns. |
| `className` | `string` | No | — | Merged on root `WrapperRoot`. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children" \| "onContextMenu">` | — | — | `loading`, `skeleton`, `loaderClassName`, `div` props, motion props; typed `onContextMenu` is the row above. |

### `message` (`ChatMessageMessage`)

`Pick<Message, …>` from `types/samaWssModels` plus optional `old_id`, `url_preview`.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `_id` | `string` | Yes | `data-message-id` on wrapper. |
| `body` | `string \| undefined` | No | Affects `onContextMenu` `copyType`; with `updated_at` drives “edited”. |
| `from` | `string` | Yes | Sender id for profile actions. |
| `attachments` | `MessageAttachment[] \| undefined` | No | If non-empty, `attachmentsNode` slot is used. |
| `status` | `MessageStatusType \| undefined` | No | Current user: `MessageStatus` only for `"sent"` \| `"read"` (see `samaWssModels`). |
| `t` | `number` | Yes | Unix **seconds** → `H:MM` in footer. |
| `created_at` | `string` | Yes | ISO; ≠ `updated_at` shows “edited”. |
| `updated_at` | `string` | Yes | ISO. |
| `cid` | `string` | Yes | Conversation id. |
| `forwarded_message_id` | `string \| undefined` | No | Truthy → “Forwarded” header. |
| `old_id` | `string \| undefined` | No | React `key` fallback. |
| `url_preview` | `unknown` | No | Not read by this component. |

## Rules

### Required

- Pass `message`, `sender`, `isCurrentUser`, `bodyContent`.
- `message` must satisfy `ChatMessageMessage` (at minimum `_id`, `from`, `t`, `created_at`, `updated_at`, `cid` for runtime layout).

### Forbidden

- Do not pass `as`, `children`; omitted from `ChatMessageProps`.
- Do not assume `onVisible` runs — it is unused in `ChatMessage.tsx`.
- Do not assume `isBlockStart` affects rendering — unused; use `showAuthor` / `isPrevMessageYours`.

### Preferred

- Pass `attachmentsNode` when `message.attachments?.length`; pass `linkPreviewNode` when there are no attachments (preview is skipped if attachments exist).
- Drive `isPrevMessageYours` / `isNextMessageYours` (or `showAuthor` / `showTimestamp` / `isBlockEnd`) from the list for correct grouping.
- In selection mode, wire `onSelectClick` / `onUnselectClick` to match `isSelected`.
- Use `senderDisplayName` for label; `message.from` for `onUserProfile`.

## Examples

### Basic

```tsx
<ChatMessage
  ref={messageRef}
  message={{
    _id: "m1",
    cid: "c1",
    from: "user-1",
    body: "Hello",
    t: Math.floor(Date.now() / 1000),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }}
  sender={senderUser}
  isCurrentUser={false}
  bodyContent={<span>Hello</span>}
/>
```

### Advanced

```tsx
<ChatMessage
  className="ui:px-2"
  message={msg}
  sender={senderUser}
  isCurrentUser={currentUid === msg.from}
  bodyContent={<MessageBody markdown={msg.body} />}
  attachmentsNode={msg.attachments?.length ? <MediaAttachments files={msg.attachments} /> : undefined}
  linkPreviewNode={!msg.attachments?.length ? <MessageLinkPreview preview={msg.url_preview} /> : undefined}
  repliedMessage={replyTo}
  repliedMessageSenderName={replyAuthorName}
  onReplyClick={() => openThread(replyTo._id)}
  onUserProfile={(uid) => navigateToProfile(uid)}
  onContextMenu={(e, copyType, extra) => openMessageMenu(e, msg, copyType, extra)}
  isMobile
  onSwipeReply={() => startReply(msg)}
  swipeReplyThreshold={56}
  isLongTimeBetweenMessages
  isPrevMessageYours={prevSameAuthor}
  isNextMessageYours={nextSameAuthor}
  isSelectionMode={selectionMode}
  isSelected={selectedIds.has(msg._id)}
  onSelectClick={() => select(msg._id)}
  onUnselectClick={() => unselect(msg._id)}
  onBubblePointerDown={handleLongPressStart}
  onBubblePointerUp={handleLongPressEnd}
  hideUserIcon={compactLayout}
/>
```

## Anti-patterns

- Skipping any of `message`, `sender`, `isCurrentUser`, `bodyContent`.
- Passing `linkPreviewNode` while expecting it with attachments — implementation hides preview when `hasAttachments`.
- Expecting `MessageStatus` for current user when `status` is not `"sent"` or `"read"`.
- Nesting controls that break root selection click in `isSelectionMode` without handling events.
- Using `isBlockStart` for layout — no effect; the prop is not read in `ChatMessage.tsx`.
