# UI-kit — AI usage

## Agent prompt & Cursor

- **Full system prompt** (copy into agent instructions / chat): [`AGENT_PROMPT.md`](./AGENT_PROMPT.md).
- **Cursor:** repo rule [`.cursor/rules/ui-kit-ai-agent.mdc`](../../../.cursor/rules/ui-kit-ai-agent.mdc) — applies when files under `packages/ui-kit/**/*` are in context (`alwaysApply: false`).

## What this is

`@sama/ui-kit` (this package) is a **React + TypeScript** library: **elements** (primitives), **composites** (larger widgets), **skeletons**, and shared **types**. Implementations live under `src/components/`.

## How to find components

1. **Machine index:** `ai/components.index.json` — start here. Each key is a component name; `path` points to the markdown spec under `ai/components/`.
2. **Source of truth for behavior:** `src/components/**/<Name>.tsx` and colocated `*.types.ts` (or inline props). If docs and code disagree, **trust TypeScript**.

## Strict rules

| Rule | Detail |
| ---- | ------ |
| **Do not invent props** | Only props listed in `ai/components/<Name>.md` and/or `ChatMessageProps`-style interfaces. If missing → say **UNKNOWN** or read the `.tsx` / `.types.ts`. |
| **Use documented components** | Do not assume a component exists until it appears in `components.index.json` or you confirm `src/components`. |
| **Prefer composition** | Build flows from documented pieces; avoid duplicating markup this kit already provides. |
| **Do not break consumers** | Never rename or move `src` files from here; add docs under `ai/` only. |

## Doc layout (normalized)

Every `ai/components/<Name>.md` uses:

`Description` → `Props` (table) → `Rules` → `Examples` → `Anti-patterns`.

## Coverage note

`components.index.json` lists components that have an **`ai/components/<Name>.md`** file. Adding a new doc + index entry extends coverage without touching runtime code.

**Inventory:** see [`COMPONENTS.md`](./COMPONENTS.md) for all public exports and documentation status.

**Internals (not in the index):** see [`INTERNAL_BUILDING_BLOCKS.md`](./INTERNAL_BUILDING_BLOCKS.md) for how non-exported building blocks affect public components (`LastMessage`, `WrapperRoot`, profile avatars, `VideoView` play overlay, `OtherUserProfile` view modes, etc.).

**Adapters:** [`ADAPTERS.md`](./ADAPTERS.md) — `setAdapters` / `getAdapters`, `SamaAdapters` summary, which components call which namespaces.

**Composition examples:** [`RECIPES.md`](./RECIPES.md) — common screen patterns (list + composer, search, group info, profile).

**Types wider than runtime:** [`TYPE_VS_IMPLEMENTATION.md`](./TYPE_VS_IMPLEMENTATION.md) — known gaps; always trust `.tsx` for forwarding when unsure.
