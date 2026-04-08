# SearchInput

## Description

Search field in a **`WrapperRoot` `div`**; supports **controlled** (`value` + `onChange(value: string)`) or **legacy uncontrolled** (`setState`). **`onChange`** replaces native `div` typing — omitted from `WrapperRoot` extension. Optional **`inputRef`**, size and animation flags.

**Source:** `src/components/elements/SearchInput/SearchInput.tsx`, `SearchInput.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `placeholder` | `string` | No | — | Input placeholder. |
| `value` | `string` | No | — | Controlled value. |
| `onChange` | `(value: string) => void` | No | — | Controlled updates. |
| `setState` | `(value: string \| null) => void` | No | — | Legacy uncontrolled. |
| `isLargeSize` | `boolean` | No | — | Larger icon/text. |
| `disableAnimation` | `boolean` | No | — | Skip enter animation. |
| `customClassName` | `string` | No | — | Extra wrapper classes. |
| `inputRef` | `RefObject<HTMLInputElement \| null>` | No | — | Native input ref. |
| `className` | `string` | No | — | Root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children" \| "onChange">` | — | — | `loading`, `skeleton`, `loaderClassName`, other div props except native `onChange`. |

## Rules

### Preferred

- Use **`value` + `onChange`** for new code; avoid mixing `setState` and controlled `value` without intent.

## Examples

### Controlled

```tsx
<SearchInput placeholder="Search…" value={q} onChange={setQ} inputRef={ref} />
```

## Anti-patterns

- Passing DOM `onChange` event handler — API expects **string** callback.
