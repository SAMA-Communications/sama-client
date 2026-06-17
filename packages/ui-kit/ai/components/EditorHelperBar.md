# EditorHelperBar

## Description

Floating **help** control: link to **docs** (`docsHref`, `docsLabel`), **tooltip** (`tooltipId`), and **`actions`** (label + onClick) shown in the tooltip panel.

**Source:** `src/components/composites/EditorHelperBar/EditorHelperBar.tsx`, `EditorHelperBar.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `docsHref` | `string` | Yes | Documentation URL. |
| `docsLabel` | `string` | No | Link text. |
| `tooltipId` | `string` | Yes | A11y / tooltip target id. |
| `actions` | `EditorHelperAction[]` | Yes | `{ label, onClick }[]`. |
| `actionButtonClassName` | `string` | No | Action buttons in tooltip. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` | — | — |

## Rules

### Required

- `docsHref`, `tooltipId`, `actions`.

## Examples

```tsx
<EditorHelperBar
  docsHref="/docs/api"
  tooltipId="editor-help"
  actions={[{ label: "Format", onClick: format }]}
/>
```

## Anti-patterns

- Duplicate **`tooltipId`** on the same page — clashes with tooltip targets.
