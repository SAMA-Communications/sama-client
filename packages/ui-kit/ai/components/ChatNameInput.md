# ChatNameInput

## Description

Group-chat creation UI: optional single avatar file (picker + preview), name field, **Cancel** and **Continue**. Validates non-empty trimmed name and max length, then `onConfirm(trimmed, file | null)`. **Enter** triggers the same submit path as **Continue** (`useKeyDown` + `KEY_CODES.ENTER`).

**Source:** `src/components/composites/ChatNameInput/ChatNameInput.tsx`, `ChatNameInput.types.ts`. **Types over docs** if they disagree.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `onConfirm` | `(name: string, image: File \| null) => void` | Yes | — | After successful validation: trimmed name, first picked file or `null`. |
| `onCancel` | `() => void` | Yes | — | **Cancel** button. |
| `onValidationError` | `(message: string) => void` | No | — | Empty name or length > `MAX_CHAT_NAME_LENGTH`; if omitted, user may see no feedback. |
| `className` | `string` | No | — | Merged on root `WrapperRoot`. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — | `loading`, `skeleton`, `loaderClassName`, `div` props, motion props. No `as` / `children`. |

### Constants and DOM (not props)

Defined in implementation / `@utils/constants` — not `ChatNameInputProps`:

| Item | Value / behavior |
| ---- | ---------------- |
| `MAX_CHAT_NAME_LENGTH` | `255` (`@utils/constants`) |
| Empty name error | `"Enter a name for the group chat."` |
| Too long error | String includes `MAX_CHAT_NAME_LENGTH` |
| File `accept` | `ALLOWED_AVATAR_FORMATS`: `.heic`, `.HEIC`, `image/jpeg`, `image/png` |
| Files kept | First file only (`multiple={false}`) |
| Placeholder gradient | `generateSoftPastelGradient("")` until image selected |

## Rules

### Required

- Pass `onConfirm` and `onCancel`.

### Forbidden

- Do not pass `as` or `children`; omitted from `ChatNameInputProps`.

### Preferred

- Implement `onValidationError` for toasts or inline errors.
- If instances mount/unmount often, consider revoking object URLs — component uses `URL.createObjectURL` and does not revoke on unmount.

## Examples

### Basic

```tsx
<ChatNameInput
  onConfirm={(name, image) => {
    createGroup({ name, avatarFile: image });
  }}
  onCancel={() => closeModal()}
  onValidationError={(msg) => toast.error(msg)}
/>
```

### Advanced

```tsx
<ChatNameInput
  className="ui:p-4 ui:rounded-2xl ui:bg-white"
  loading={isSubmitting}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  onValidationError={setErrorText}
/>
```

## Anti-patterns

- Omitting `onConfirm` or `onCancel`.
- Omitting `onValidationError` but expecting visible validation feedback.
- Assuming validation on each keystroke — runs on **Continue** / **Enter** only.
- Expecting multiple files — only one is stored and passed to `onConfirm`.
