# EditorLogsPanel

## Description

Collapsible **logs** region for the programmable editor. When **`visible`** is false, renders **nothing**. **`onClose`** dismisses; **`children`** is typically a read-only log surface.

**Source:** `src/components/composites/EditorLogsPanel/EditorLogsPanel.tsx`, `EditorLogsPanel.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `visible` | `boolean` | Yes | Mount panel when true. |
| `onClose` | `() => void` | Yes | Close handler. |
| `children` | `ReactNode` | Yes | Log content. |
| `className` | `string` | No | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children">` + `children` | — | — |

## Rules

### Required

- `visible`, `onClose`, `children`.

## Examples

```tsx
<EditorLogsPanel visible={showLogs} onClose={() => setShowLogs(false)}>
  <LogsEditor readOnly />
</EditorLogsPanel>
```

## Anti-patterns

- Keeping **`visible`** true without rendering meaningful **`children`** — empty panel.
