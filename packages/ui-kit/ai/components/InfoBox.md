# InfoBox

## Description

Read-only or **editable** info row: **`title`**, **`value`**, optional **`systemTitle`**, **`iconType`** (`phone` \| `email` \| `login`), **`placeholder`**, **`hideIfNull`**, **`onClick`**, **`onChangeValue`**, **`isEnableToEdit`**, **`isIconEnable`**. **`WrapperRoot`** `div`.

**Source:** `src/components/elements/InfoBox/InfoBox.tsx`, `InfoBox.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `title` | `string` | Yes | Field label. |
| `systemTitle` | `string` | No | Secondary title. |
| `value` | `string \| undefined` | Yes | Current value. |
| `iconType` | `IconType` | No | `"phone"` \| `"email"` \| `"login"`. |
| `placeholder` | `string` | No | Empty state. |
| `hideIfNull` | `boolean` | No | Hide when no value. |
| `onClick` | `MouseEventHandler<HTMLDivElement>` | No | Row click. |
| `onChangeValue` | `(name: string, value: string) => void` | No | Edit submit. |
| `isEnableToEdit` | `boolean` | No | Inline edit mode. |
| `isIconEnable` | `boolean` | No | Show icon. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Rules

### Required

- `title`, `value` (may be `undefined` with `hideIfNull`).

## Examples

```tsx
<InfoBox title="Email" value={user.email} iconType="email" isEnableToEdit onChangeValue={patch} />
```

## Anti-patterns

- None specific.
