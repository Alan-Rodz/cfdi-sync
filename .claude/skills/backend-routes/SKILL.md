---
name: backend-routes
description: Backend route conventions for this repo. Use this skill whenever creating or editing Fastify route handlers in `package/backend/src/**`. Apply it for alphabetical ordering, mandatory `ResponseStatus` usage, route handler structure, and the preference for readable longer single-line statements (imports, simple responses) over unnecessary line wrapping.
---

# Backend Routes

Use this skill for backend route handlers in `package/backend/src/**`, especially files like `auth.ts`.

Always follow `../general-guidelines/SKILL.md` first. This skill adds backend route specifics.

## 1. Scope

Use this skill for:

- Fastify route registration files in `package/backend/src`.
- Route handlers using `request`/`reply` and JWT verification.
- Authentication and profile-related backend routes.

Do not use this skill by itself for shared schema, DB SQL, or frontend files.

## 2. Route File Shape

Preferred section order:

```ts
// ********************************************************************************
// == Type ========================================================================
// == Constant ====================================================================
// == Handler =====================================================================
```

Inside route registration functions, keep route blocks grouped and predictable:

- `Login`
- `Register`
- `Me` (or read/current-user style routes)

Use stable ordering for route definitions unless API semantics require a different flow.

## 3. Alphabetical Ordering

Strong preference for alphabetical ordering where it improves scanability and diffs:

- Sort named imports alphabetically when practical.
- Keep object literal keys alphabetized unless semantic grouping is clearer.
- Keep destructuring variable order stable and predictable.
- Keep route-local type fields in consistent, predictable order.

If semantic grouping is more important, keep stable internal ordering within each group.

## 4. ResponseStatus Usage (Required)

Always use `ResponseStatus` from `common` for HTTP status codes in route handlers.

- Do not use magic numeric literals like `401`, `404`, `500` directly in replies.
- Use `reply.status(ResponseStatus.X).send(...)` for non-200 responses.
- Use explicit status values for create/conflict/bad request/auth failures when applicable.

Examples:

```ts
return reply.status(ResponseStatus.UNAUTHORIZED).send({ data: null, message: t('auth.invalid_credentials') });
return reply.status(ResponseStatus.CREATED).send({ data: profile, message: t('auth.registration_successful'), token });
return reply.status(ResponseStatus.ERROR).send({ data: null, message: t('auth.login_failed') });
```

## 5. Prefer Longer Readable Lines

Prefer longer, readable one-line statements over unnecessary line wrapping.

- Keep named imports on one line when still readable.
- Keep short-to-medium `reply.status(...).send(...)` calls on one line.
- Keep concise object literals in one line when they remain easy to scan.

Wrap lines only when readability clearly degrades.

Examples:

```ts
import { backendApiRoutes, Database, englishTranslationFunction, logConsoleError, LoginData, Profile, profileTableColumns, profileTableName, RegisterProfileData, ResponseStatus } from 'common';

return reply.status(ResponseStatus.NOT_FOUND).send({ data: null, message: t('auth.profile_not_found') });
```

## 6. Handler Control Flow

Use early returns and guard clauses.

- Return immediately on validation/auth/data errors.
- Keep happy-path logic shallow and linear.
- Use concise intent comments for explicit branch readability where needed.

Pattern:

```ts
if (errorCondition) { return reply.status(ResponseStatus.BAD_REQUEST).send({ data: null, message: t('auth.registration_failed') }); }
/* else -- continue with happy path */
```

## 7. Auth Route Conventions

For auth-like routes:

- Use `request.jwtVerify()` for protected endpoints.
- Build JWT payloads with stable field ordering.
- Use translation keys for user-facing messages.
- Log caught errors with `logConsoleError` before returning fallback error responses.

## 8. Self-Check

Before finalizing backend route edits, confirm:

1. `ResponseStatus` is used for all explicit statuses.
2. No raw status number literals are used in replies.
3. Import/order/object key ordering is stable and mostly alphabetical.
4. Line wrapping is intentional; concise statements remain single-line.
5. Error branches return early and keep nesting shallow.
6. Message keys and response payload shape stay consistent.
