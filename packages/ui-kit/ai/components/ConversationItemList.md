# ConversationItemList

## Description

Scrollable list of **`ConversationItem`** rows with **`CustomVerticalScrollbar`**: selection state, optional built-in `localStorage` scroll persistence (`scroll_pos_${scrollContainerId}`), optional external scroll metrics (`onListScrollFromBottom`). Uses `disableBuiltinScrollPersistence` when the host owns restore logic.

**Source:** `src/components/composites/ConversationItemList/ConversationItemList.tsx`, `ConversationItemList.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `conversations` | `Conversation[]` | Yes | — | Rows to render. |
| `selectedConversation` | `Conversation \| null` | Yes | — | Highlights matching row. |
| `additionalOnClickfunc` | `Function` | No | — | Extra handler on row click (types use loose `Function`). |
| `scrollContainerRef` | `RefObject<HTMLDivElement \| null>` | No | — | External ref to scroll viewport (with `disableBuiltinScrollPersistence`). |
| `listInnerRef` | `RefObject<HTMLDivElement \| null>` | No | — | Inner wrapper ref (e.g. `ResizeObserver`). |
| `disableBuiltinScrollPersistence` | `boolean` | No | — | Skips read/write of `scroll_pos_*` keys. |
| `onListScrollFromBottom` | `(scrollFromBottom: number) => void` | No | — | Same metric as scrollbar `onScroll`. |
| `scrollContainerId` | `string` | No | — | `id` + `localStorage` key suffix when persistence on. |
| `scrollbarClassName` | `string` | No | — | Scrollbar outer flex wrapper. |
| `scrollbarContentClassName` | `string` | No | — | Viewport / `childrenClassName` on scrollbar. |
| `className` | `string` | No | — | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | `WrapperRoot` + rest. |

## Rules

### Required

- `conversations`, `selectedConversation`.

### Preferred

- Set `scrollContainerId` when using default persistence; set `disableBuiltinScrollPersistence` when persisting elsewhere.

## Examples

### Basic

```tsx
<ConversationItemList
  conversations={list}
  selectedConversation={active}
  scrollContainerId="chat-list-main"
/>
```

## Anti-patterns

- Relying on scroll restore without `scrollContainerId` while persistence is enabled — behaviour depends on implementation defaults.
