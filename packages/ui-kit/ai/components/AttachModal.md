# AttachModal

## Description

Modal for composing a message with **file attachments**: lists files via `MediaAttachments`, textarea (`TextAreaInput`), **Send** / **Cancel** / add-more. Title defaults from file count. States: `isSending` (“Processing…”), `isPending` + empty files (`OvalLoader`), empty files (“Select files”). Backdrop click calls `onCancel`. Extra props spread to `Modal`.

**Source:** `src/components/composites/AttachModal/AttachModal.tsx`, `AttachModal.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `files` | `MediaAttachmentData[]` | Yes | — | Shown in list; drives default title. |
| `onRemoveFile` | `(index: number) => void` | Yes | — | Remove at index. |
| `onSend` | `(e?: React.MouseEvent) => void` | Yes | — | Primary send action. |
| `onCancel` | `() => void` | Yes | — | Cancel + backdrop. |
| `onAddMore` | `() => void` | Yes | — | Add files (e.g. open picker). |
| `inputRef` | `RefObject<HTMLTextAreaElement \| null>` | No | — | Textarea ref. |
| `onInput` | `(e: FormEvent<HTMLTextAreaElement>) => void` | No | — | Textarea input. |
| `onKeyDown` | `(e: KeyboardEvent<HTMLTextAreaElement>) => void` | No | — | Textarea keys. |
| `placeholder` | `string` | No | `"Type your message..."` | Textarea placeholder. |
| `isSending` | `boolean` | No | `false` | Disables actions / shows processing copy. |
| `isPending` | `boolean` | No | `false` | Loader when no files yet. |
| `title` | `string` | No | — | Overrides auto title from file count. |
| `attachmentsMaxHeight` | `string` | No | `min(460px, calc(100svh - 300px))` | List max height (CSS). |
| `contentClassName` | `string` | No | `""` | Panel classes (merged with internal panel layout). |
| `className` | `string` | No | — | On `Modal` root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children" \| "onInput" \| "onKeyDown">` | — | — | Rest forwarded to `Modal`; textarea handlers are the explicit props above. |

## Rules

### Required

- `files`, `onRemoveFile`, `onSend`, `onCancel`, `onAddMore`.

### Forbidden

- Do not assume `onInput` / `onKeyDown` are on the `Modal` rest object — they are separate textarea props in this component.

### Preferred

- Keep `files` in sync with picker state; use `isPending` while picking first batch.

## Examples

### Basic

```tsx
<AttachModal
  files={attachments}
  onRemoveFile={(i) => removeAt(i)}
  onSend={() => submit()}
  onCancel={close}
  onAddMore={openPicker}
  inputRef={taRef}
  onInput={onDraftChange}
  onKeyDown={onDraftKeyDown}
/>
```

## Anti-patterns

- Omitting `onAddMore` when UX requires adding files after open.
- Leaving `isSending` true without disabling duplicate sends in the parent.
