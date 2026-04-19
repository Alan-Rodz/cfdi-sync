---
name: backend-controllers
description: Backend controller and composition conventions for this repo. Use this skill whenever creating or editing Fastify controllers/handlers in `package/backend/src/**`, especially `package/backend/src/controller/**` and backend bootstrap wiring. Apply it for class-based controller structure, feature-scoped dependency injection, controller registry composition, centralized Fastify auth preHandlers, request-scoped Supabase auth context, mandatory `ResponseStatus` usage, and predictable handler organization.
---

# Backend Controllers

Use this skill for backend controllers, route handlers, and backend composition in `package/backend/src/**`, especially files like `controller/auth/AuthController.ts`.

Always follow `../general-guidelines/SKILL.md` first. This skill adds backend controller and route specifics.

## 1. Scope

Use this skill for:

- Controller classes in `package/backend/src/controller/**`.
- Fastify route handlers using `request`/`reply` and JWT verification.
- Backend bootstrap + controller registry wiring in `package/backend/src/index.ts` and `package/backend/src/controller/index.ts`.
- Fastify request decoration and auth preHandler patterns such as `request.authContext` and `server.authenticateWithSupabase`.

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
- Keep `ControllerDependencies` generic (cross-controller only, for example `t` and `loggerPort`) and place feature ports/services only in feature-specific dependency types.

Route registration conventions:

- `addRoutes` should stay thin and map routes to handler methods.
- Protected routes should prefer shared `preHandler` hooks registered on the Fastify instance instead of repeating auth extraction in each handler.
- Route business control flow should live in private handler methods.
- Reuse base controller helpers for mapping service results and unexpected errors.

Registry composition conventions:

- In `controller/index.ts`, use a controller-registry dependency type that contains shared dependencies plus feature sections (for example `auth`).
- Map feature sections to controller constructors explicitly, rather than typing the whole registry as one controller's dependency type.

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

- Register shared auth hooks in backend bootstrap and prefer route `preHandler` usage such as `server.authenticateWithSupabase` for protected endpoints.
- Do not manually parse Supabase access token headers in each controller once a shared preHandler exists.
- Read authenticated request state from shared request decorations such as `request.authContext`.
- Build JWT payloads with stable field ordering.
- Use the injected translation function for user-facing fallback messages.
- Log caught errors with `logConsoleError` before returning fallback error responses.

Do not register `@fastify/jwt` inside individual controllers. Register it once in backend bootstrap.

For RLS-protected Supabase operations (factory pattern):

- Attach only the `supabaseAccessToken` to the request context in the shared auth preHandler (not a full scoped Supabase client).
- Inject a `*RepositoryFactoryPort` (for example `ProfileRepositoryFactoryPort`) into feature-specific controller dependencies.
- Controllers call `factory.forAuthenticatedRequest(authContext.supabaseAccessToken)` to get a request-scoped repository instance.
- Pass the repository instance into lifecycle/service methods, not Supabase clients or tokens.
- The factory handles Supabase client scoping internally; repositories receive only a ready-to-use client.
- This keeps use-case services free of infrastructure client knowledge and preserves strong ports-and-adapters boundaries.

## 10. Self-Check

Before finalizing backend controller edits, confirm:

1. `ResponseStatus` is used for all explicit statuses.
2. No raw status number literals are used in replies.
3. Plugins (for example JWT) are registered in bootstrap, not per controller.
4. Protected routes prefer shared Fastify `preHandler` auth hooks over inline `jwtVerify` + header parsing.
5. Controllers extend the shared `Controller` base class.
6. `addRoutes` is thin and mainly maps routes to handler methods.
7. Service dependencies are created/injected in controller constructor, not in `addRoutes`.
8. Import/order/object key ordering is stable and mostly alphabetical.
9. Line wrapping is intentional; concise statements remain single-line.
10. Error branches return early and keep nesting shallow.
11. Message keys and response payload shape stay consistent.
12. `ControllerDependencies` remains generic and does not include feature-specific ports.
13. Controller registry dependencies are grouped by feature and mapped explicitly per controller.
14. Protected handlers read from shared `request.authContext` (which contains `supabaseAccessToken` but not a full Supabase client).
15. Controllers inject and use `*RepositoryFactoryPort` to create request-scoped repository instances for protected operations.
16. Services receive `*RepositoryPort` instances (created by the factory), not Supabase clients or tokens.

## 11. Adding New CRUD Entities

To add a new CRUD entity (for example `Invoice`), follow this 10-step checklist in order:

**Step 1: SQL Table (Source of Truth)**
- Create `package/common/src/db/table/{entity}.sql` with table definition.
- Include timestamps and `PRIMARY KEY`.
- Follow trigger pattern for `updated_at` if applicable.

**Step 2: Types in `common`**
- Create `package/common/src/entity/{entity}/type.ts` with `type {Entity} = Database['public']['Tables']['{entity}']['Row']`.
- Create `package/common/src/entity/{entity}/constant.ts` with `{entity}TableName` and `{entity}TableColumns`.
- Create `package/common/src/entity/{entity}/index.ts` barrel and export from `common/src/index.ts`.

**Step 3: Define Ports**
- Create `package/backend/src/service/entity/{entity}/type.ts`.
- Define `{Entity}RepositoryPort` with business-shaped methods (for example `findById`, `create`, `update`).
- Define `{Entity}RepositoryFactoryPort` with `forAuthenticatedRequest(token): {Entity}RepositoryPort`.

**Step 4: Repository Adapter**
- Create `package/backend/src/service/entity/{entity}/Supabase{Entity}Repository.ts`.
- Implement `{Entity}RepositoryPort`.
- Constructor takes `SupabaseClient<Database>` and optional `LoggerPort`.
- Methods use `this.client` directly (already scoped); no token handling.

**Step 5: Repository Factory**
- Create `package/backend/src/service/entity/{entity}/Supabase{Entity}RepositoryFactory.ts`.
- Implement `{Entity}RepositoryFactoryPort`.
- `forAuthenticatedRequest(token)` creates a scoped Supabase client and returns a repository instance.

**Step 6: Service Lifecycle**
- Create `package/backend/src/service/entity/{entity}/{Entity}Lifecycle.ts`.
- Constructor takes `t: LocaledTranslationFn` and optional `LoggerPort`.
- Public methods accept `repository: {Entity}RepositoryPort` as last parameter (never Supabase clients or tokens).
- Return `ServiceResult<T>` with consistent status codes.

**Step 7: Controller**
- Create `package/backend/src/controller/{entity}/{Entity}Controller.ts`.
- Extend `Controller` base class.
- Constructor takes `{Entity}ControllerDependencies`.
- `addRoutes` registers protected routes with `preHandler: server.authenticateWithSupabase`.
- Protected handlers resolve repository via `factory.forAuthenticatedRequest(authContext.supabaseAccessToken)`.

**Step 8: Controller Types**
- Create `package/backend/src/controller/{entity}/type.ts`.
- Define `{Entity}ControllerDependencies` extending `ControllerDependencies`.
- Include `{entity}RepositoryFactoryPort` and optional `{entity}Lifecycle`.

**Step 9: Controller Registry**
- Add feature section to `ControllerRegistryDependencies` (for example `invoice: { invoiceRepositoryFactoryPort }`)
- Map feature section to new controller constructor.

**Step 10: Bootstrap Wiring**
- In `package/backend/src/index.ts`, instantiate `Supabase{Entity}RepositoryFactory`.
- Pass factory into controller registry dependencies under feature section.

**Reuse from ProfileLifecycle**
- Copy the pattern from `package/backend/src/service/entity/profile/ProfileLifecycle.ts` for login/register if applicable.
- For authenticated-only operations, always pass repository port as parameter.
- Always use `ResponseStatus` constants and translation function `t`.
- Always catch errors and log via `safeLogError`.

**Consistency checks**
- Ensure all public repository methods are port methods (no `internal` helper methods in the repository).
- Ensure service never accepts Supabase clients or tokens as parameters.
- Ensure controller always resolves repository from factory per request.
- Ensure message keys follow convention (for example `entity.invoice.created`, `entity.invoice.fetch_failed`).
