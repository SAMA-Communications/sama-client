# InteractiveDate

## Description

Formats **`date`** with **`toLocaleDateString`** using **`locale`** (default **`en-US`**) and **`options`** (`Intl.DateTimeFormatOptions`). **`DateInput`** = unix seconds, ISO string, or `Date`.

**Source:** `src/components/elements/InteractiveDate/InteractiveDate.tsx`, `InteractiveDate.types.ts`.

## Props

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `date` | `DateInput` | Yes | `number \| string \| Date`. |
| `locale` | `string` | No | BCP 47 locale. |
| `options` | `Intl.DateTimeFormatOptions` | No | Format options. |

## Rules

### Required

- `date`.

## Examples

```tsx
<InteractiveDate date={msg.t} locale="uk-UA" options={{ dateStyle: "medium" }} />
```

## Anti-patterns

- Passing **milliseconds** when component expects **seconds** — verify call sites (chat `t` is usually seconds).
