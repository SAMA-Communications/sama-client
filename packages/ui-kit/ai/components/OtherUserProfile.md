# OtherUserProfile

## Description

**Other user** profile (not “self” profile): **`user`** subset model, **`displayName`**, optional **`statusActivity`**, **card** vs **compact** layout (`view` / `defaultView`), mobile **back**, **close**, **start conversation**. Custom **`closeButton`** / **`backButton`** override defaults.

**Source:** `src/components/composites/OtherUserProfile/OtherUserProfile.tsx`, `OtherUserProfile.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `user` | `OtherUserProfileUser` | Yes | Avatar + contact fields subset. |
| `displayName` | `string` | Yes | Title name. |
| `statusActivity` | `string` | No | Subtitle (e.g. last seen). |
| `isMobile` | `boolean` | No | Layout. |
| `onClose` | `() => void` | No | Desktop close. |
| `onBack` | `() => void` | No | Mobile back. |
| `onStartConversation` | `() => void` | No | CTA. |
| `contentClassName` | `string` | No | Scroll wrapper (card mode). |
| `closeButton` | `ReactNode` | No | Custom close control. |
| `backButton` | `ReactNode` | No | Custom back control. |
| `view` | `OtherUserProfileViewMode` | No | Controlled: `"card"` \| `"compact"`. |
| `defaultView` | `OtherUserProfileViewMode` | No | Uncontrolled default (`"card"`). |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Rules

### Required

- `user`, `displayName`.

## Examples

```tsx
<OtherUserProfile
  user={u}
  displayName={fullName}
  statusActivity="Last seen recently"
  onClose={close}
  onStartConversation={openDm}
  view="compact"
/>
```

## Anti-patterns

- Passing full **`User`** wire type without needed display fields — `OtherUserProfileUser` is a subset; ensure avatar/url fields exist for UI.
