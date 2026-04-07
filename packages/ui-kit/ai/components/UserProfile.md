# UserProfile

## Description

Current-user profile surface: fields, **Logout**, optional **Edit**, **Close**, **navigate to auth** after destructive actions. Uses adapters internally for data/actions. **`shareRef`** is on the props type but **not used** in `UserProfile.tsx` today.

**Source:** `src/components/composites/UserProfile/UserProfile.tsx`, `UserProfile.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `user` | `User` | Yes | Profile subject. |
| `shareRef` | `Ref<HTMLElement>` | No | Reserved; not wired in component. |
| `onLogout` | `() => void \| Promise<void>` | Yes | Logout action. |
| `triggerExitEvent` | `() => void` | No | Optional teardown before close. |
| `onClose` | `() => void` | Yes | Back / dismiss. |
| `onEditProfile` | `() => void` | No | Edit profile entry. |
| `onNavigateToAuth` | `() => void` | No | After delete / session end. |

## Rules

### Required

- `user`, `onLogout`, `onClose`.

## Examples

### Basic

```tsx
<UserProfile user={me} onLogout={logout} onClose={() => setOpen(false)} onEditProfile={() => edit()} />
```

## Anti-patterns

- Relying on **`shareRef`** for share targets — implement in host or extend component.
