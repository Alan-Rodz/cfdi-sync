---
name: general-guidelines
description: Repo-wide coding conventions for the repo. Use this skill whenever creating or editing TypeScript, TSX, or SQL in this repository, especially for `package/common`, `package/web`, and `package/lite-web`. Apply it even when the user does not explicitly ask for style changes, so new code stays consistent with separators, import ordering, Supabase table constants, SQL source-of-truth patterns, early-return control flow, and alphabetical ordering conventions.
---

# General Guidelines

Use this skill to keep code aligned with conventions already used across this repository.

If unsure about a style choice, read `references/repo-examples.md` and follow the nearest matching example.

For React, TSX, hooks, Next.js pages/layouts, and UI helper files in `package/web` or `package/lite-web`, also follow `../frontend-files/SKILL.md` for frontend-specific file structure.

## 1. Start With Repo Structure

Prefer these placement rules first:

- Shared operation definitions, request utilities, schemas, and entity types belong in `package/common/src/**`.
- Web and lite-web packages consume from `common` rather than redefining operation contracts.
- Database schema source of truth is SQL under `package/common/src/db/**` (especially `table/`, plus `fn/`, `policy/`, `storage/`).
- Entity conventions are centered in `package/common/src/schema/entity/**`.

When adding a new cross-package operation:

1. Define data/response/schema in `package/common/src/schema/**`.
2. Export via nearest `index.ts` barrel in `common`.
3. Consume from `common` in `web` / `lite-web`.

## 2. Use Section Separators Consistently

In TS/TSX files, use separators exactly like this:

```ts
// ********************************************************************************
// == Type ========================================================================
// == Constant ====================================================================
// == Schema ======================================================================
// -- Handler ---------------------------------------------------------------------
// .. Util ........................................................................
```

Conventions:

- `// ********************************************************************************` starts major file sections.
- `// == ...` is for primary sections.
- `// -- ...` is for subsection blocks.
- `// .. ...` is for utility/minor blocks.

In SQL files, mirror the pattern with SQL comments:

```sql
-- Definition ---------------------------------------------------------------------
-- handle_updated_at_profile ------------------------------------------------------
-- Function -----------------------------------------------------------------------
```

## 3. Import Ordering

Default order from top to bottom:

1. Third-party modules.
2. Cross-package workspace modules (for example `common`, `common-web`).
3. Same-package alias imports (for example `email/...` inside `package/web`).
4. Local relative imports (`./`, `../`, `../../`).

Also:

- Keep a blank line between import groups.
- Sort imports alphabetically within each group when practical.
- Preserve known exceptions where file comments explain why sorting is intentionally disabled (for example circular dependency protection).

## 4. Supabase Table Access Pattern

Do not hardcode table or column names in query strings when constants exist.

For each entity, define and use:

- `<entity>TableName`
- `<entity>TableColumns`

Pattern:

```ts
export const profileTableName: Extract<keyof Database['public']['Tables'], 'profile'> = 'profile' as const;

export const profileTableColumns: { [key in keyof Profile]: key } = {
 created_at: 'created_at',
 email: 'email',
 id: 'id',
 img_url: 'img_url',
 name: 'name',
 updated_at: 'updated_at',
} as const;
```

Query usage pattern:

```ts
await client
 .from(profileTableName)
 .update({ name })
 .eq(profileTableColumns.id, profile_id);
```

## 5. SQL Is Source Of Truth

When schema changes are needed:

- Update SQL first in `package/common/src/db/table/**` (and related `fn/`, `policy/`, `storage/` as needed).
- Keep SQL formatting and section separators consistent.
- Ensure TS schema/constants reflect SQL, not vice versa.

Timestamp convention:

- Use `TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())` for timestamp columns.
- Keep formatting aligned with neighboring columns.
- Do not introduce mixed timestamp patterns in new tables unless intentionally matching an existing legacy file.

## 6. Alphabetical And Predictable Ordering

Strong preference:

- Keep object keys alphabetized where it improves scanability (schema keys, table columns, config objects).
- In component/hooks, prefer stable and predictable declaration order (often alphabetical left-to-right or top-to-bottom).
- Keep related destructured variables grouped and consistently ordered.

If strict alphabetical order conflicts with semantic grouping, keep grouping but maintain stable internal order.

## 7. Control Flow Style

Favor early exits and shallow nesting:

- Validate early, return/throw early.
- Avoid deep `if` nesting when guard clauses work.

Prefer explicit branches:

- Include `else` blocks when they clarify intent.
- If omitting a body, use explicit inline comments (for example `/* else -- no phone_number */`).
- Keep return values explicit and descriptive (for example `return true/*successful update*/;`).

## 8. Common Contract Reuse

When implementing API routes in `web` or `lite-web`:

- Import request/response types and validation schemas from `common`.
- Validate request objects using shared schema helpers.
- Reuse shared `RequestHandler` and rate limit helpers where applicable.

Avoid redefining schema types locally if an equivalent exists in `common`.

## 9. Additional Patterns To Preserve

- Keep barrel exports (`index.ts`) updated when adding new modules used cross-package.
- Prefer typed schema key objects such as `postAmenitySchemaKeys` to avoid string literals spread across files.
- Keep comments concise, practical, and directly tied to intent.
- Match local indentation/spacing style of the file you are editing.
- In SQL and TS, follow neighboring casing conventions (`NOW()` vs `now()`) unless doing a deliberate normalization pass.

## 10. Pre-Commit Self-Check

Before finalizing edits, confirm:

1. Correct package/file placement for shared vs package-specific code.
2. Separator style is present and consistent.
3. Import groups are in correct order.
4. Supabase operations use `*TableName` and `*TableColumns` constants.
5. SQL changes remain source of truth and timestamp conventions are respected.
6. Branching uses early returns and explicit `else` intent where helpful.
7. New exports are wired through relevant barrel files.

## Examples

### Example: Route Handler Shape

```ts
// == POST =======================================================================
export const POST = async (req: NextRequest) => RequestHandler.handleRequestOnServer<ResponseData>(
 req,
 LIMITER,
 CHECK_RATE_LIMIT_OPTIONS,
 async (body) => {
  if (!(await isValidObject(body, getPostSchema()))) { throw getBadRequestError(); }

  const client = await createSupaBaseServerClient();
  await setSupabaseToken(req, client);

  const { entity_id } = body as PostData;
  if (!entity_id) { throw new Error('Missing entity_id'); }
  else { /* else -- valid entity_id */ }

  return true/*successful operation*/;
 }
);
```

### Example: Entity Constants Shape

```ts
// == Table =======================================================================
export const entityTableName: Extract<keyof Database['public']['Tables'], 'entity'> = 'entity' as const;

// == Column ======================================================================
export const entityTableColumns: { [key in keyof Entity]: key } = {
 created_at: 'created_at',
 id: 'id',
 updated_at: 'updated_at',
} as const;
```

### Example: SQL Table Header Shape

```sql
-- Definition ---------------------------------------------------------------------
CREATE TABLE entity (
 id                  UUID NOT NULL DEFAULT UUID_GENERATE_V4(),
 created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
 updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
 PRIMARY KEY(id)
);
```
