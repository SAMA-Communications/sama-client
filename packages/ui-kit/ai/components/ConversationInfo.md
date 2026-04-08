# ConversationInfo

## Description

Conversation details panel (`WrapperRoot` as **`section`**): metadata, participants, actions (edit group, add participants), per-participant profile and context menu hooks. Mobile vs desktop layout controlled by `isMobile`.

**Source:** `src/components/composites/ConversationInfo/ConversationInfo.tsx`, `ConversationInfo.types.tsx`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `conversation` | `Conversation` | Yes | — | Conversation to display. |
| `isMobile` | `boolean` | Yes | — | Layout variant. |
| `shareRef` | `Ref<HTMLDivElement>` | No | — | Declared on props; **not referenced** in `ConversationInfo.tsx` (reserved / future). |
| `onClose` | `() => void` | Yes | — | Close panel. |
| `onEditConversation` | `() => void` | No | — | “Edit group info”. |
| `onAddParticipants` | `() => void` | No | — | Add participants. |
| `onParticipantOpenProfile` | `(uid: string \| null) => void` | No | — | Row tap; `null` may mean current user. |
| `onParticipantContextMenu` | `(params) => void` | No | — | See `ConversationInfo.types.tsx` for `category`, `list`, `coords`, `externalProps`, `clicked`. |
| `className` | `string` | No | — | Root `section`. |
| *(extends)* | `Omit<WrapperRootProps<"section">, "as" \| "children">` | — | — | Root uses `as="section"` in implementation. |

## Rules

### Required

- `conversation`, `isMobile`, `onClose`.

### Preferred

- Provide `onParticipantContextMenu` if context menus are required for parity with native clients.

## Examples

### Basic

```tsx
<ConversationInfo
  conversation={c}
  isMobile={isPhone}
  onClose={() => setOpen(false)}
  onEditConversation={() => edit(c)}
  onParticipantOpenProfile={(uid) => openProfile(uid)}
/>
```

## Anti-patterns

- Omitting `onClose` — user cannot dismiss the panel from the component’s own controls.
