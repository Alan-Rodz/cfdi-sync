---
name: backend-routes
description: Backend controller and route conventions for this repo. Use this skill whenever creating or editing Fastify controllers/handlers in `package/backend/src/**`, especially `package/backend/src/controller/**` and backend bootstrap wiring. Apply it for class-based controller structure, dependency injection, controller registry usage, mandatory `ResponseStatus` usage, and predictable handler organization.
---

# Backend Controllers

Use this skill for backend controllers, route handlers, and backend registration in `package/backend/src/**`, especially files like `controller/auth/AuthController.ts`.

Always follow `../general-guidelines/SKILL.md` first. This skill adds backend controller and route specifics.

## 1. Scope

Use this skill for:

- Controller classes in `package/backend/src/controller/**`.
- Fastify route handlers using `request`/`reply` and JWT verification.
- Backend bootstrap + controller registry wiring in `package/backend/src/index.ts` and `package/backend/src/controller/index.ts`.

Do not use this skill by itself for shared schema, DB SQL, or frontend files.

## 2. Controller File Shape

Preferred architecture:

- Framework/plugin registration in bootstrap (`package/backend/src/index.ts`).
- Controller instances created in controller registry (`package/backend/src/controller/index.ts`).
- Route registration performed by controller instances via `addRoutes(server)`.

Controllers should be class-based and extend the shared `Controller` base class.

Constructor conventions:

- Accept controller-specific dependencies (for example `AuthControllerDependencies`).
- Call `super(dependencies)`.
- Build or assign controller-owned service dependencies in constructor.
- Prefer optional dependency injection for testability (for example `profileLifecycle?: ProfileLifecycle`).

Route registration conventions:

- `addRoutes` should stay thin and map routes to handler methods.
- Route business control flow should live in private handler methods.
- Reuse base controller helpers for mapping service results and unexpected errors.

## 3. File Section Order

Preferred section order:

```ts
// ********************************************************************************
// == Type ========================================================================
// == Constant ====================================================================
// == Handler =====================================================================
```

Inside controllers, keep route blocks grouped and predictable:

- `Login`
- `Register`
- `Me` (or read/current-user style routes)

Use stable ordering for route definitions unless API semantics require a different flow.

## 4. Alphabetical Ordering

Strong preference for alphabetical ordering where it improves scanability and diffs:

- Sort named imports alphabetically when practical.
- Keep object literal keys alphabetized unless semantic grouping is clearer.
- Keep destructuring variable order stable and predictable.
- Keep route-local type fields in consistent, predictable order.

If semantic grouping is more important, keep stable internal ordering within each group.

## 5. ResponseStatus Usage (Required)

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

## 6. Controller Response + Service Result Conventions

Prefer these shared contracts:

- Service layer returns `ServiceResult<T>`.
- Controller sends `ControllerResponse<T>`.
- Controllers should use reusable base helpers where available (`sendServiceResult`, `sendUnexpectedError`) to avoid repetitive reply mapping.

Keep the service/controller split clear:

- Services: business and persistence logic.
- Controllers: request/reply flow and HTTP status semantics.

## 7. Prefer Longer Readable Lines

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

## 8. Handler Control Flow

Use early returns and guard clauses.

- Return immediately on validation/auth/data errors.
- Keep happy-path logic shallow and linear.
- Use concise intent comments for explicit branch readability where needed.

Pattern:

```ts
if (errorCondition) { return reply.status(ResponseStatus.BAD_REQUEST).send({ data: null, message: t('auth.registration_failed') }); }
/* else -- continue with happy path */
```

## 9. Auth Route Conventions

For auth-like routes:

- Use `request.jwtVerify()` for protected endpoints.
- Build JWT payloads with stable field ordering.
- Use the injected translation function for user-facing fallback messages.
- Log caught errors with `logConsoleError` before returning fallback error responses.

Do not register `@fastify/jwt` inside individual controllers. Register it once in backend bootstrap.

## 10. Self-Check

Before finalizing backend controller edits, confirm:

1. `ResponseStatus` is used for all explicit statuses.
2. No raw status number literals are used in replies.
3. Plugins (for example JWT) are registered in bootstrap, not per controller.
4. Controllers extend the shared `Controller` base class.
5. `addRoutes` is thin and mainly maps routes to handler methods.
6. Service dependencies are created/injected in controller constructor, not in `addRoutes`.
7. Import/order/object key ordering is stable and mostly alphabetical.
8. Line wrapping is intentional; concise statements remain single-line.
9. Error branches return early and keep nesting shallow.
10. Message keys and response payload shape stay consistent.
