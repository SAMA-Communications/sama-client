# ResetPasswordModal

## Description

Multi-step **reset password** flow inside a modal: send OTP, enter code + new password, resend. **`onSendOTP`**, **`onResetPassword`**, **`onResendOTP`** return/resolve **booleans** to advance or close. **`onValidationError`** for client-side messaging.

**Source:** `src/components/composites/ResetPasswordModal/ResetPasswordModal.tsx`, `ResetPasswordModal.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `isOpen` | `boolean` | Yes | Controls visibility. |
| `onClose` | `() => void` | Yes | Dismiss. |
| `onSendOTP` | `(email: string) => Promise<boolean>` | Yes | Step 1 → true advances. |
| `onResetPassword` | `(data: ResetPasswordFormData) => Promise<boolean>` | Yes | Final submit; true closes. |
| `onResendOTP` | `(email: string) => Promise<void>` | Yes | Resend handler. |
| `onValidationError` | `(message: string) => void` | No | Show errors. |

### `ResetPasswordFormData`

`email?`, `token?`, `new_password?` — see `ResetPasswordModal.types.ts`.

## Rules

### Required

- All callbacks; wire **async** success flags correctly to avoid stuck steps.

## Examples

### Basic

```tsx
<ResetPasswordModal
  isOpen={open}
  onClose={() => setOpen(false)}
  onSendOTP={api.requestOtp}
  onResetPassword={api.reset}
  onResendOTP={api.resend}
  onValidationError={toast.error}
/>
```

## Anti-patterns

- Returning `false` from **`onResetPassword`** without surfacing why — user is stuck; use **`onValidationError`**.
