# ProgrammableEditorDocsBanner

## Description

Simple **documentation** link banner: **`href`** and optional **`label`**. No `WrapperRoot` on the public props type.

**Source:** `src/components/composites/ProgrammableEditorDocsBanner/ProgrammableEditorDocsBanner.tsx`, `ProgrammableEditorDocsBanner.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `href` | `string` | Yes | Docs URL. |
| `label` | `string` | No | Link text. |

## Rules

### Required

- `href`.

## Examples

```tsx
<ProgrammableEditorDocsBanner href="https://docs.example.com" label="API reference" />
```

## Anti-patterns

- None specific.
