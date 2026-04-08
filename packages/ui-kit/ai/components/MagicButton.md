# MagicButton

## Description

**AI / magic** affordance next to the composer; **`inputTextRef`** (same pattern as **`MessageInput`**, typed **`any`**), **`isBlockedConv`** disables interaction. Uses adapters internally.

**Source:** `src/components/elements/MagicButton/MagicButton.tsx`, `MagicButton.type.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `inputTextRef` | `RefObject<any>` | Yes | Composer input ref. |
| `isBlockedConv` | `boolean` | Yes | Disable when chat blocked. |

## Rules

### Required

- **`setAdapters`** / `getAdapters` configured like **`MessageInput`**.

## Examples

```tsx
<MagicButton inputTextRef={ref} isBlockedConv={false} />
```

## Anti-patterns

- Using without **`MessageInput`** wiring — behaviour depends on shared adapter state.
