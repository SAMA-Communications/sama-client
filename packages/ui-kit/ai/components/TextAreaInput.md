# TextAreaInput

## Description

Plain **textarea** wrapper: **`inputRef`**, **`onInput`**, **`onKeyDown`**, **`onBlur`**, standard HTML attributes (`placeholder`, `disabled`, `autoFocus`, `autoComplete`, `id`, `className`). No `WrapperRoot`.

**Source:** `src/components/elements/TextAreaInput/TextAreaInput.tsx`, `TextAreaInput.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `id` | `string` | No | Element id. |
| `className` | `string` | No | Textarea classes. |
| `inputRef` | `RefObject<HTMLTextAreaElement \| null>` | No | Ref to `<textarea>`. |
| `onInput` | `(e: FormEvent<HTMLTextAreaElement>) => void` | No | Input events. |
| `onKeyDown` | `(e: KeyboardEvent<HTMLTextAreaElement>) => void` | No | Keys (e.g. Enter to send). |
| `onBlur` | `(e: FocusEvent<HTMLTextAreaElement>) => void` | No | Blur. |
| `placeholder` | `string` | No | — |
| `disabled` | `boolean` | No | — |
| `autoFocus` | `boolean` | No | — |
| `autoComplete` | `string` | No | — |

## Rules

### Preferred

- Use with **`AttachModal`** / composers that need multiline + key handlers.

## Examples

### Basic

```tsx
<TextAreaInput
  inputRef={taRef}
  placeholder="Message"
  onInput={onDraft}
  onKeyDown={onKey}
/>
```

## Anti-patterns

- Expecting built-in autosize — not part of this component unless added in host styles.
