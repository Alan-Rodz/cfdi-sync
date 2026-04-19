---
name: general-guidelines
description: Repo-wide coding conventions for the repo. Use this skill whenever creating or editing TypeScript, TSX, or SQL in this repository, including backend files in `package/backend/src/**`. Apply it even when the user does not explicitly ask for style changes, so new code stays consistent with separators, import ordering, Supabase table constants, SQL source-of-truth patterns, backend ports/adapters boundaries, controller/service layering, early-return control flow, and alphabetical ordering conventions.
---

# General Guidelines

Use this skill to keep code aligned with conventions already used across this repository.

If unsure about a style choice, read `references/repo-examples.md` and follow the nearest matching example.

For React, TSX, hooks, Next.js pages/layouts, and UI helper files in `package/frontend`, also follow `../frontend-files/SKILL.md` for frontend-specific file structure, JSX prop ordering, and Material UI `sx` conventions.

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
- **Prefer single-line imports** over multi-line imports, even for many named exports:

```ts
// Preferred
import { LoginData, Profile, profileTableColumns, profileTableName, RegisterUserData } from 'common';

// Avoid
import {
 LoginData,
 Profile,
 profileTableColumns,
 profileTableName,
 RegisterUserData
} from 'common';
```

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
- In JSX, order props predictably from left to right. If `className` exists, place it first; otherwise keep props alphabetical when practical.
- For Material UI `sx` objects, keep style keys alphabetized top to bottom when practical for stable diffs and predictable scanning.
- Keep related destructured variables grouped and consistently ordered.

If strict alphabetical order conflicts with semantic grouping, keep grouping but maintain stable internal order.

**Example: JSX Prop Order**

```tsx
// props alphabetically when className is absent
<Component
  backgroundColor="white"
  disabled={false}
  onClick={handleClick}
  sx={{ alignItems: 'center', display: 'flex', gap: 2 }}
  title="Example"
/>
```

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

## 9. Backend Controller Architecture

For backend files in `package/backend/src/**`:

- Keep Fastify plugin registration (for example JWT, CORS) in bootstrap (`package/backend/src/index.ts`) instead of inside individual controllers.
- Use controller registry composition (`package/backend/src/controller/index.ts`) to construct and register controller instances.
- Prefer class-based controllers that extend the shared `Controller` base class and implement `addRoutes(server)`.
- Keep `addRoutes` thin: map routes to private handler methods rather than embedding full control flow inline.
- Construct/inject service dependencies in controller constructor, not in `addRoutes`.
- Keep service logic in service classes and HTTP response mapping in controllers.

## 10. Backend Ports And Adapters

For backend services in `package/backend/src/**`, follow these boundaries:

- Define capability contracts as `*Port` types in feature-local files (for example `service/entity/profile/type.ts`).
- Keep use case services depending on ports (`ProfileRepositoryPort`, `ProfileAuthPort`) instead of framework clients.
- Keep concrete client usage (for example Supabase query/auth calls) inside adapter classes (for example `SupabaseProfileRepository`, `SupabaseProfileAuth`).
- Keep app bootstrap (`package/backend/src/index.ts`) as the composition root where adapters are constructed and injected.

For controller dependencies:

- Keep `ControllerDependencies` generic and cross-controller only (for example translation function `t` and shared `loggerPort`).
- Define feature-specific controller dependency types (for example `AuthControllerDependencies`) that extend base dependencies.
- In controller registry (`package/backend/src/controller/index.ts`), use a registry dependency shape with feature sections (for example `auth`) and map each section to its controller.

## 11. Additional Patterns To Preserve

- Keep barrel exports (`index.ts`) updated when adding new modules used cross-package.
- Prefer typed schema key objects such as `postAmenitySchemaKeys` to avoid string literals spread across files.
- Keep comments concise, practical, and directly tied to intent.
- Match local indentation/spacing style of the file you are editing.
- In SQL and TS, follow neighboring casing conventions (`NOW()` vs `now()`) unless doing a deliberate normalization pass.

## 12. Pre-Commit Self-Check

Before finalizing edits, confirm:

1. Correct package/file placement for shared vs package-specific code.
2. Separator style is present and consistent.
3. Import groups are in correct order.
4. Supabase operations use `*TableName` and `*TableColumns` constants.
5. SQL changes remain source of truth and timestamp conventions are respected.
6. Branching uses early returns and explicit `else` intent where helpful.
7. New exports are wired through relevant barrel files.
8. Services depend on `*Port` interfaces and not directly on Supabase clients.
9. Supabase-specific code stays in adapter classes and bootstrap wiring.
10. `ControllerDependencies` remains generic; feature dependencies stay in feature controller types.

## 13. Architecture Glossary

- **Port**: A feature-level interface/contract that defines what the application needs (for example `ProfileRepositoryPort`) without binding to a specific infrastructure client.
- **Adapter**: A concrete implementation of a port using a specific technology (for example `SupabaseProfileRepository`, `SupabaseProfileAuth`).
- **Composition Root**: The app bootstrap location where adapters are instantiated and injected into services/controllers (for example `package/backend/src/index.ts`).
- **Feature Dependency Scope**: The rule that feature-specific dependencies belong to feature controller types (`AuthControllerDependencies`) and not to generic shared types (`ControllerDependencies`).

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
