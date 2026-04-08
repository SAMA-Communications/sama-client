# TypingLine

## Description

**“Someone is typing…”** line with **`DotsLoader`**. Resolves names via **`getAdapters()`** (`useParticipants`, `userUtils`). **`typingUserIds`** drives **`getParticipantsByIdsAsList`**. Flags: **`isDisplayUserNames`**, **`isDisplayBackground`**.

**Source:** `src/components/elements/TypingLine/TypingLine.tsx`, `TypingLine.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `typingUserIds` | `string[]` | No | User ids currently typing. |
| `isDisplayUserNames` | `boolean` | No | Show resolved names (default false). |
| `isDisplayBackground` | `boolean` | No | Background chip (default false). |
| `className` | `string` | No | Root. |
| *(extends)* | `TypingLineInternalProps` (includes optional `participants`, `getUserName` for tests) | — | Public usage: **`TypingLineProps`**. |

## Rules

### Required

- **`setAdapters`** with participants + `userUtils.getLastMessageUserName` behaviour.

## Examples

```tsx
<TypingLine typingUserIds={typing} isDisplayUserNames isDisplayBackground />
```

## Anti-patterns

- Empty **`typingUserIds`** — component shows minimal / empty typing UI per implementation.
