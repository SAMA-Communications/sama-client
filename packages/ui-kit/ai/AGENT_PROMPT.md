# UI-kit — system prompt for AI agents

Copy the block below into agent instructions, a custom GPT, or as a preamble in Cursor when working with this package.

In the **sama-client** repo, Cursor already includes a rule: `.cursor/rules/ui-kit-ai-agent.mdc` (applies when files under `packages/ui-kit/**/*` are in context).

---

```
You are working with a React + TypeScript UI-kit package (monorepo path: packages/ui-kit).

SOURCES OF TRUTH (in this order):
1) packages/ui-kit/ai/components.index.json — ALWAYS start here: component list, path to spec, short description, props (type, required, values only for string/number literal unions).
2) packages/ui-kit/ai/AI_GUIDE.md — how to work with the package and its docs.
3) packages/ui-kit/ai/components/<ComponentName>.md — normalized spec: Description → Props (table) → Rules → Examples → Anti-patterns.
4) packages/ui-kit/ai/intents.json — optional: user intent → component names.
5) packages/ui-kit/ai/INTERNAL_BUILDING_BLOCKS.md — optional: non-exported pieces (WrapperRoot, LastMessage, …) that explain public composite behavior; not in components.index.json.
6) packages/ui-kit/ai/ADAPTERS.md — optional: setAdapters/getAdapters and per-component adapter usage.
7) packages/ui-kit/ai/RECIPES.md — optional: composition patterns for screens.
8) packages/ui-kit/ai/TYPE_VS_IMPLEMENTATION.md — optional: props on types not read by implementation (see also per-component .md).
9) Source: packages/ui-kit/src/components/**/<Component>.tsx and *.types.ts — if docs lack detail or behavior must be verified.

SEARCH STRATEGY (minimize tokens):
- First read components.index.json and determine the relevant ComponentName.
- Open only ai/components/<ComponentName>.md for that component.
- If the issue is wiring, data not updating, or “component uses adapters” — read ADAPTERS.md and RECIPES.md before deep-diving all of src.
- For “why does public component X ignore prop Y” — TYPE_VS_IMPLEMENTATION.md and the component .md.
- Do not read all of src until the spec is insufficient.

STRICT RULES:
- Do not invent props, types, or events — only what appears in index.json, the matching .md, or TypeScript.
- If information is missing — state UNKNOWN explicitly and name the file to open or extend.
- Do not assume a component exists for the AI catalog until it appears in components.index.json (or is clearly present under src/components). INTERNAL_BUILDING_BLOCKS.md explains internals only — do not treat them as indexed public APIs.
- Prefer composing existing documented components instead of duplicating markup.
- Do not suggest changing public imports, renaming src files, or removing existing APIs without an explicit user request.

RESPONSE FORMAT:
- For component API: table or prop list aligned with docs; required vs optional separated.
- For code examples: minimal valid example first, then extended if needed; imports must match project aliases (@composites/…, @elements/…, etc.).

PROJECT CONTEXT:
- Canonical AI specs: packages/ui-kit/ai/components/. If docs and code disagree, trust TypeScript.
```

---

## Short form (limited context)

```
UI-kit: components.index.json → ai/components/<Name>.md → AI_GUIDE.md; optional INTERNAL_BUILDING_BLOCKS, ADAPTERS, RECIPES, TYPE_VS_IMPLEMENTATION → src. Do not invent props. Not in docs → say UNKNOWN. Prefer documented components and composition.
```
