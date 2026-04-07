# Modal

## Description

Centered **`role="dialog"`** panel with **`AnimatePresence`** scale animation. **Overlay** (`fixed` backdrop) calls **`onClick`** only when the click target is the overlay itself (not the panel); panel **`stopPropagation`** on click. **`ModalProps` extends `WrapperRootProps<"div">`**, but the implementation only reads **`children`**, **`panelClassName`**, **`contentKey`**, **`tall`**, **`className`**, **`onClick`** — other `div` / loader props on the type are **not applied** in the current component (safe to omit).

**Source:** `src/components/elements/Modal/Modal.tsx`, `Modal.types.ts`.

## Props

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `children` | `ReactNode` | Yes | — | Panel body. |
| `panelClassName` | `string` | No | `""` | Classes merged with default panel shell. |
| `contentKey` | `string` | No | — | `motion.div` key for step transitions. |
| `tall` | `boolean` | No | `false` | Taller min-height / overflow panel. |
| `className` | `string` | No | — | Overlay wrapper classes. |
| `onClick` | `(e: MouseEvent<HTMLDivElement>) => void` | No | — | Backdrop dismiss (direct overlay hit only). |
| *(on type only)* | Other `WrapperRootProps` / `div` props | — | — | **Not forwarded** by `Modal.tsx` today. |

## Rules

### Required

- `children`.

### Preferred

- Pass **`onClick`** for dismiss (e.g. `onClose`) to match overlay UX.

## Examples

### Basic

```tsx
<Modal onClick={close} panelClassName="ui:p-6">
  <p>Content</p>
</Modal>
```

## Anti-patterns

- Expecting **`loading`** / **`skeleton`** on `Modal` to render — not wired in implementation.
- Relying on clicks on the panel to close — panel stops propagation.
