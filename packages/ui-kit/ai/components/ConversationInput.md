# ConversationInput

## Description

Composer shell around **`MessageInput`**: drafts, send, edit flow, attachment hub hook, magic button toggle. Uses **`getAdapters()`** for `useDrafts`, `useMessages`, `useConversations`, `useParticipants`, `formatedUtils` — host must register adapters before render.

**Source:** `src/components/composites/ConversationInput/ConversationInput.tsx`, `ConversationInput.type.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `chatMessagesBlockRef` | `RefObject<HTMLDivElement>` | Yes | — | Messages area ref (layout/scroll coordination). |
| `editedMessage` | `{ _id: string; body: string } \| null \| undefined` | No | — | When set, input is in edit mode for that message. |
| `isEnableMagicButton` | `boolean` | No | `true` | Passed through to `MessageInput`. |
| `onOpenAttachmentHub` | `() => void` | No | — | Attachment entry from `MessageInput`. |
| `isLocationIncludeAttach` | `boolean` | No | — | When true, draft restore behaviour skips attach screen case. |
| `className` | `string` | No | — | Root `WrapperRoot`. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | Spread to root `WrapperRoot` with `...rest`. |

## Rules

### Required

- `chatMessagesBlockRef`.
- Working **adapters** (`setAdapters`) for drafts/messages/conversations/participants.

### Preferred

- Provide `onOpenAttachmentHub` when attachments are supported.

## Examples

### Basic

```tsx
<ConversationInput chatMessagesBlockRef={messagesRef} />
```

## Anti-patterns

- Rendering without adapter setup — runtime errors from `getAdapters()`.
- Omitting `chatMessagesBlockRef` — type error.
