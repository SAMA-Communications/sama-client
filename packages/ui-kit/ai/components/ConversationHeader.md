# ConversationHeader

## Description

Chat header: tab strip (`currentTab` / `changeTabFunc`), selection-mode actions (forward, close selection), close/back (`closeFormFunc`, optional `closeIcon`), tap to open info (`onOpenChatOrParticipantInfo`). Uses `Conversation` + `User` from wire models.

**Source:** `src/components/composites/ConversationHeader/ConversationHeader.tsx`, `ConversationHeader.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `conversation` | `Conversation` | Yes | — | Active conversation. |
| `isSelectionMode` | `boolean` | Yes | — | Shows forward / cancel selection UI when true. |
| `currentTab` | `string` | Yes | — | Active tab id for controlled tabs. |
| `changeTabFunc` | `(tab: string) => void` | Yes | — | Tab change handler. |
| `closeFormFunc` | `MouseEventHandler<HTMLButtonElement>` | Yes | — | Close/back control. |
| `closeIcon` | `ReactNode` | No | — | Replaces default `ChevronLeft` when set. |
| `onForwardSection` | `() => void` | No | — | Selection mode: forward. |
| `onCloseSelectionMode` | `() => void` | No | — | Selection mode: exit. |
| `onOpenChatOrParticipantInfo` | `(conversation: Conversation, participant: User \| null) => void` | No | — | Header tap → info sheet. |
| `className` | `string` | No | — | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | `WrapperRoot` + `div` + motion. |

## Rules

### Required

- `conversation`, `isSelectionMode`, `currentTab`, `changeTabFunc`, `closeFormFunc`.

### Preferred

- Wire `onCloseSelectionMode` whenever `isSelectionMode` can become true.

## Examples

### Basic

```tsx
<ConversationHeader
  conversation={active}
  isSelectionMode={selecting}
  currentTab={tab}
  changeTabFunc={setTab}
  closeFormFunc={() => router.back()}
  onOpenChatOrParticipantInfo={(c, p) => openInfo(c, p)}
  onForwardSection={forwardSelected}
  onCloseSelectionMode={() => setSelecting(false)}
/>
```

## Anti-patterns

- Using empty `currentTab` without defining tab ids used by `changeTabFunc`.
