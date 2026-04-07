# MessageInput

## Description

Chat **composer** row: text field, send control, attachment entry, magic button, blocked/edit/sending states. Consumes **`getAdapters()`** drafts/messages like **`ConversationInput`**. **`inputTextRef`** is typed as **`RefObject<any>`** in source — host should pass a ref compatible with the internal input API.

**Source:** `src/components/elements/MessageInput/MessageInput.tsx`, `MessageInput.type.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `inputTextRef` | `RefObject<any>` | Yes | Ref to composer input (legacy typing). |
| `isBlockedConv` | `boolean` | Yes | Disable send / show blocked UX. |
| `isEditAction` | `boolean` | Yes | Edit mode styling/behaviour. |
| `isMobile` | `boolean` | Yes | Layout variant. |
| `isSending` | `boolean` | Yes | In-flight send. |
| `isEnableMagicButton` | `boolean` | Yes | Show magic / AI affordance. |
| `onSubmitFunc` | `MouseEventHandler<SVGSVGElement>` | Yes | Send button (SVG) click. |
| `onOpenAttachmentHub` | `() => void` | No | Attachments. |
| `isLocationIncludeAttach` | `boolean` | No | Skip draft restore on attach screen. |

## Rules

### Required

- Adapters configured (**`setAdapters`**) like **`ConversationInput`**.
- All boolean flags and **`onSubmitFunc`**.

## Examples

### Basic

```tsx
<MessageInput
  inputTextRef={ref}
  isBlockedConv={false}
  isEditAction={false}
  isMobile={isPhone}
  isSending={pending}
  isEnableMagicButton
  onSubmitFunc={submit}
  onOpenAttachmentHub={openAttach}
/>
```

## Anti-patterns

- Using **`MessageInput`** without **`ConversationInput`**-level draft wiring unless you duplicate adapter setup.
