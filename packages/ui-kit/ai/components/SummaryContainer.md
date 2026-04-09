# SummaryContainer

## Description

Floating **“Here’s what you missed”** panel: AI summary text, optional **filter** label via **`getFilterLabel`**, loading **`OvalLoader`**. Returns **null** if `summaryContent` is null/undefined. Not a modal — positioned card with close (**X**).

**Source:** `src/components/composites/SummaryContainer/SummaryContainer.tsx`, `SummaryContainer.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `summaryContent` | `SummaryContent \| null \| undefined` | No | `{ isLoading?, text?, filter? }`; missing → render nothing. |
| `onClose` | `() => void` | Yes | Close control. |
| `getFilterLabel` | `(filter: string \| undefined) => string` | No | Human label for filter chip. |

## Rules

### Required

- `onClose` whenever the panel can show; if `summaryContent` is always null, component never mounts UI.

## Examples

### Basic

```tsx
<SummaryContainer
  summaryContent={{ isLoading: false, text: summary, filter: "7d" }}
  onClose={() => setSummary(null)}
  getFilterLabel={(f) => (f === "7d" ? "Last 7 days" : f ?? "")}
/>
```

## Anti-patterns

- Passing `summaryContent` with neither `text` nor `isLoading` — may show empty body.
