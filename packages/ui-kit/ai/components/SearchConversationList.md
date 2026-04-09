# SearchConversationList

## Description

Vertical list of conversations for search/pick flows; optional section **title**, **emptyMessage** when `conversations.length === 0`. Delegates row UI to **`ConversationItem`** pattern (see implementation).

**Source:** `src/components/composites/SearchConversationList/SearchConversationList.tsx`, `SearchConversationList.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `conversations` | `Conversation[]` | Yes | Rows. |
| `selectedConversationId` | `string \| null \| undefined` | No | Highlights matching `_id`. |
| `onConversationClick` | `(cid: string) => void` | Yes | User picked a chat (`cid`). |
| `showTitle` | `boolean` | No | Show list heading. |
| `emptyMessage` | `string \| null \| undefined` | No | Copy when list empty. |

## Rules

### Required

- `conversations`, `onConversationClick`.

## Examples

### Basic

```tsx
<SearchConversationList
  conversations={results}
  selectedConversationId={activeCid}
  onConversationClick={(cid) => navigate(cid)}
  emptyMessage="No chats found"
/>
```

## Anti-patterns

- None specific.
