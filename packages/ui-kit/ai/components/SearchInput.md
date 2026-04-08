# SearchInput

## Description

Controlled search field inside a **`WrapperRoot` `div`**. Native **`<input type="search">`** with **`role="search"`** on the wrapper. **`onChange`** receives a **string** (not a DOM event); `WrapperRoot`’s native `onChange` is omitted from the props type. Clicking the **wrapper** focuses the input. When **`value`** is non-empty, a **clear** control (`aria-label="Clear search"`) calls **`onChange("")`** and uses **`stopPropagation`** so the wrapper does not steal focus logic.

**Source:** `src/components/elements/SearchInput/SearchInput.tsx`, `SearchInput.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `value` | `string` | Yes | — | Controlled text. |
| `onChange` | `(value: string) => void` | Yes | — | Updates text; clear button passes `""`. |
| `placeholder` | `string` | No | `"Search"` | Placeholder and **`aria-label`** on the input. |
| `isLargeSize` | `boolean` | No | `false` | Larger icon and input font size token. |
| `customClassName` | `string` | No | `""` | Extra wrapper classes. |
| `className` | `string` | No | — | Merged on root. |
| *(extends)* | `Omit<WrapperRootProps<"div">, "as" \| "children" \| "onChange">` | — | — | `loading`, `skeleton`, motion/DOM props on root except native `onChange`. |

## Rules

### Required

- `value` and `onChange` — component is **controlled only**.

### Preferred

- Keep `value` in React state (or a store) and pass through unchanged semantics for clear.

## Examples

### Controlled

```tsx
const [q, setQ] = useState("");
<SearchInput placeholder="Search…" value={q} onChange={setQ} />
```

## Anti-patterns

- Passing a DOM **`ChangeEvent`** handler — API expects **`(value: string) => void`**.
- Omitting **`value` / `onChange`** — unsupported; use a wrapper state with `""` default.
