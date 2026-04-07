# EditorCodePanel

## Description

Programmable editor **code area** chrome: **`statusText`** line (e.g. “Recent changes…”) and **`children`** (Monaco or similar). **`WrapperRoot`** `div`.

**Source:** `src/components/composites/EditorCodePanel/EditorCodePanel.tsx`, `EditorCodePanel.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `statusText` | `string` | Yes | Status / attribution line. |
| `children` | `ReactNode` | Yes | Editor body. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` + `children` | — | Standard `WrapperRoot` extras. |

## Rules

### Required

- `statusText`, `children`.

## Examples

```tsx
<EditorCodePanel statusText="Saved 12:00" className="ui:flex-1 ui:min-h-0">
  <MonacoEditor />
</EditorCodePanel>
```

## Anti-patterns

- None specific.
