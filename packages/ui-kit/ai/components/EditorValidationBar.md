# EditorValidationBar

## Description

Editor **validation** toolbar: **`statusNode`** (icon area), **tooltip** (`tooltipId`, `tooltipContent`), **Check** and **Save** actions (`onCheck`, `onSave`, `saveDisabled`), optional **`children`** slot (e.g. test message input).

**Source:** `src/components/composites/EditorValidationBar/EditorValidationBar.tsx`, `EditorValidationBar.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `statusNode` | `ReactNode` | Yes | Status icon (loader / check / error). |
| `tooltipId` | `string` | Yes | Tooltip anchor id. |
| `tooltipContent` | `ReactNode` | Yes | Tooltip body. |
| `onCheck` | `() => void` | Yes | Run validation. |
| `onSave` | `() => void` | Yes | Save action. |
| `saveDisabled` | `boolean` | Yes | Disable save button. |
| `children` | `ReactNode` | No | Extra slot (e.g. input). |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` + optional `children` | — | — |

## Rules

### Required

- `statusNode`, `tooltipId`, `tooltipContent`, `onCheck`, `onSave`, `saveDisabled`.

## Examples

```tsx
<EditorValidationBar
  statusNode={isOk ? <Check /> : <OvalLoader width={20} height={20} />}
  tooltipId="val-tooltip"
  tooltipContent={<ul>{issues}</ul>}
  onCheck={validate}
  onSave={save}
  saveDisabled={!canSave}
/>
```

## Anti-patterns

- Reusing **`tooltipId`** with other editor tooltips on the same view.
