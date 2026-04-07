# Type vs implementation

Some **`Props` interfaces extend `WrapperRootProps`** or carry **legacy / reserved** fields. TypeScript may allow more than the `.tsx` reads. For **public** components, prefer this order:

1. **`ai/components/<Name>.md`** — normalized spec (often calls out gaps in Description or Props table).
2. **`*.types.ts`** — full type surface.
3. **`<Name>.tsx`** — what is actually read at runtime.

This file lists **known** mismatches so agents do not assume every typed prop is wired. When in doubt, read the component source.

---

## Documented in component specs

| Component | Note | Spec |
| --------- | ---- | ---- |
| `Modal` | Extends `WrapperRootProps<"div">`; implementation only uses a subset (`children`, `panelClassName`, `contentKey`, `tall`, overlay `className`, `onClick`). | [`components/Modal.md`](./components/Modal.md) |
| `ChatMessage` | e.g. `onVisible` not invoked; `isBlockStart` not read; some `message` fields unused — see Props table and message shape notes. | [`components/ChatMessage.md`](./components/ChatMessage.md) |
| `UserProfile` | `shareRef` on type, not used in `UserProfile.tsx`. | [`components/UserProfile.md`](./components/UserProfile.md) |

---

## General pattern

- **`Omit<WrapperRootProps<...>, "as" | "children">`** — many components spread `...rest` onto **`WrapperRoot`**, so DOM/motion props **are** forwarded unless the component destructures them away. Exceptions (e.g. `Modal`) are called out in the relevant `.md`.
- **Adapter-driven components** — behavior depends on `getAdapters()` as much as on props; see [`ADAPTERS.md`](./ADAPTERS.md).

---

## Adding new entries

When you discover a prop that exists on the type but is never read in `.tsx`, document it in the component’s **`ai/components/<Name>.md`** (Props table or Description), then add a row here for discoverability.
