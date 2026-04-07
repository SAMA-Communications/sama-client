# ConversationSelectModal

## Description

**`Modal`** with fixed header (title + close), optional **`topContent`** (e.g. search), and scrollable body via **`CustomVerticalScrollbar`**. Overlay and X button call **`onClose`**.

**Source:** `src/components/composites/ConversationSelectModal/ConversationSelectModal.tsx`, `ConversationSelectModal.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `title` | `string` | Yes | — | Header title. |
| `onClose` | `() => void` | Yes | — | Close button + backdrop (`Modal` `onClick`). |
| `topContent` | `ReactNode` | No | — | Non-scrolling block under header. |
| `children` | `ReactNode` | Yes | — | Scrollable list/content. |

## Rules

### Required

- `title`, `onClose`, `children`.

## Examples

### Basic

```tsx
<ConversationSelectModal title="Forward to" onClose={close} topContent={<SearchInput ... />}>
  <SearchBlock ... />
</ConversationSelectModal>
```

## Anti-patterns

- Putting long fixed chrome only in `children` without `topContent` — header area won’t stay pinned above scroll (only title row is fixed by layout).
