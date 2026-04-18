---
name: frontend-files
description: Frontend file conventions for the repo. Use this skill whenever creating or editing React, TSX, hooks, Next.js pages/layouts, or UI helpers in `package/frontend`.  Apply it for component structure, type/props ordering, section separators, hook layout, JSX organization, and export placement, while still inheriting repo-wide rules from the `general-guidelines` skill.
---

# Frontend Files

Use this skill for TSX and frontend-facing TS files in `package/frontend`. 

Always follow the repo-wide rules from `../general-guidelines/SKILL.md` first. This skill adds frontend-specific structure on top.

## 1. Scope

Use this skill for:

- React components.
- Hooks in frontend packages.
- Next.js app entry files such as `page.tsx`, `layout.tsx`, `not-found.tsx`, and `global-error.tsx`.
- Frontend form helpers and UI utility files.

Do not use this skill by itself for backend-only route handlers, shared schema files, or SQL. Those should continue to follow `general-guidelines`.

## 2. Common File Shapes

### Component files

Typical order:

```ts
// ********************************************************************************
// == Type ========================================================================
// == Constant ====================================================================
// == Component ===================================================================
// -- State -----------------------------------------------------------------------
// -- Effect ----------------------------------------------------------------------
// -- Handler ---------------------------------------------------------------------
// -- UI --------------------------------------------------------------------------
```

Notes:

- Omit sections that are unnecessary.
- Do not add empty separators just to satisfy a template.
- `Type` is commonly present when there are props or local helper types.
- `Component` is the main section header for the file.

### Hook files

Typical order:

```ts
// ********************************************************************************
// == Type ========================================================================
// == Constant ====================================================================
// -- State -----------------------------------------------------------------------
// -- Effect ----------------------------------------------------------------------
// -- Handler ---------------------------------------------------------------------
// -- Return ----------------------------------------------------------------------
```

For simple hooks, the file may skip `Type` and `Constant` entirely and export the hook directly after the top separator.

### App entry files

For certain pages, a bottom export section is common:

```ts
// == Export ======================================================================
export default SomePage;
```

Do not force this pattern onto every component file. In this repo, many components are exported inline at declaration time.

## 3. Props And Type Ordering

Strong preference:

- Define props keys alphabetically from top to bottom.
- Keep destructured component props in a stable, readable order.
- When a type has many fields, keep them alphabetized unless semantic grouping is materially clearer.

Example:

```ts
type Props = {
 disclosure: Disclosure;
 isEditable: boolean;
};
```

## 4. Import Ordering For Frontend Files

Use the repo-wide import grouping, which commonly becomes:

1. Third-party packages.
2. Cross-package imports such as `common` and `common-web`.
3. App alias imports such as `@/ui/...` and `@/request/...`.
4. Relative local imports.
5. Side-effect CSS imports near the end when needed.

Keep blank lines between groups.

## 5. Component Body Structure

Inside React components, keep a predictable progression:

1. Context/hooks and other derived values near the top.
2. `State` section.
3. `Effect` section.
4. `Handler` section.
5. `UI` section.

This matters because it keeps files easy to scan and makes diffs more predictable.

## 6. JSX And UI Conventions

Prefer:

- A dedicated `// -- UI` section before the returned JSX in non-trivial components.
- Stable prop ordering in JSX when practical.
- Readable multiline props once lines get dense.
- Small helper components split out when a single return block becomes hard to follow.

Avoid:

- Deeply nested inline logic when a derived variable or handler would make intent clearer.
- Unstable reordering of props or sections without a reason.

## 7. Export Placement Nuance

Use the existing repo pattern instead of forcing one universal export rule:

- Inline named exports are common for components, hooks, contexts, and helpers.
- Bottom `Export` sections are common for Next.js entry files and some config-style modules.
- When editing an existing file, preserve its export style unless there is a strong reason to normalize it.

## 8. Client Component Conventions

When a file requires client-only React features in Next app code:

- Keep `'use client';` at the top.
- Leave a blank line after it before imports.
- Follow the same separator and section patterns after imports.

## 9. Practical Rules

- Match the local file’s terse style. Many frontend files here are compact.
- Use separators to clarify structure, not to make files longer.
- Preserve inline named export style when it is already the dominant file pattern.
- Prefer consistency with neighboring files over abstract stylistic purity.

## 10. Self-Check

Before finalizing a frontend file, confirm:

1. The file still follows `general-guidelines`.
2. Type and component sections are present when useful.
3. Props/types are alphabetized unless there is a clear grouping reason.
4. State/effects/handlers/UI appear in a predictable order.
5. Export placement matches the repo pattern for that file type.
6. JSX is readable and not overloaded with inline logic.

## Examples

### Example: Component file shape

```ts
// ********************************************************************************
// == Type ========================================================================
type Props = {
 label: string;
 value: string;
};

// == Component ===================================================================
export const ExampleComponent: FC<Props> = ({ label, value }) => {
 // -- State ----------------------------------------------------------------------
 const [open, setOpen] = useState(false);

 // -- Handler --------------------------------------------------------------------
 const handleClick = () => setOpen(true);

 // -- UI -------------------------------------------------------------------------
 return <div onClick={handleClick}>{label}: {value}</div>;
};
```

### Example: App entry export shape

```ts
const SomePage = async () => {
 return <div />;
};

// == Export ======================================================================
export default SomePage;
```
