# Blog Roles & Permissions - Microservices Architecture

![Test Suite](https://github.com/jsextonprofessional/blog_roles_perms/actions/workflows/test.yml/badge.svg)

A blog app demonstrating API Gateways, Microservices, Authentication, and Authorization (roles and permissions).

Built with SvelteKit, Node.js, Express, Prisma, and TypeScript.

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
│  (SvelteKit)│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         API Gateway (Port 3000)     │
│  - Authentication (JWT)             │
│  - Rate Limiting                    │
│  - Audit Logging                    │
│  - Request Routing                  │
└──────┬──────────────────────┬───────┘
       │                      │
       ▼                      ▼
┌──────────────┐      ┌──────────────┐
│ Auth Service │      │ Blog Service │
│  (Port 4000) │      │  (Port 4001) │
│              │      │              │
│  - Register  │      │  - Articles  │
│  - Login     │      │  - Comments  │
│  - JWT       │      │  - AuthZ     │
└──────┬───────┘      └──────┬───────┘
       │                     │
       ▼                     ▼
  ┌─────────┐          ┌─────────┐
  │ Users DB│          │ Blogs DB│
  │  :5432  │          │  :5433  │
  └─────────┘          └─────────┘
```

## 🎯 Goals

Demonstrate proficiency in:

- **API Gateway Pattern**: Single entry point with centralized middleware
- **Microservices**: Decoupled auth and blog services
- **Authentication**: JWT-based token authentication
- **Authorization**: Role-based access control (RBAC)

## 👥 User Roles & Permissions

The app supports four privilege levels:

1. **Guest** (!authenticated) - Read-only access
2. **User** - Create articles and comments
3. **Author** - Edit/delete own content (user.id matches resource owner)
4. **Admin** - Full access to all resources

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 10+
- Docker Desktop
- PostgreSQL (via Docker)

### 1. Clone and Install

```bash
git clone <your-repo>
cd blog_roles_perms
pnpm install
```

### 2. Start Databases

```bash
docker compose up -d  # Starts PostgreSQL DBs on ports 5432, 5433
```

### 3. Setup Services

```bash
# Auth Service
cd services/authn
cp .env.example .env
pnpm prisma migrate dev
pnpm prisma generate
cd ../..

# Blog Service
cd services/blog
cp .env.example .env
pnpm prisma migrate dev
pnpm prisma generate
cd ../..

# Gateway
cd gateway
cp .env.example .env
cd ..
```

### 4. Run All Services

```bash
# From root directory
pnpm dev  # Starts gateway (3000), authn (4000), blog (4001), frontend
```

### 5. Run Tests

```bash
# Run all tests across monorepo (73 tests total)
pnpm test

# Test breakdown:
# - Gateway: 6 tests (auth, rate limiting, audit)
# - Authn: 20 tests (registration, login, JWT, RBAC)
# - Blog: 47 tests (24 authz unit tests + 23 integration tests)

# Run tests in watch mode
pnpm test:watch

# Build all packages
pnpm build
```

**Note**: All tests use dedicated test databases (`users_test`, `blogs_test`) to ensure complete isolation from dev/prod data. See [TESTING.md](TESTING.md) for details.

## 🧪 Testing

All services include comprehensive integration tests that run against dedicated test databases:

- **Gateway**: 6 tests (authentication, rate limiting, audit logging)
- **Authn Service**: 20 tests (registration, login, JWT, RBAC)
- **Blog Service**: 47 tests (authorization policies, CRUD operations)
- **Total**: 73 tests

```bash
# Run all tests
pnpm test

# Test in watch mode
pnpm test:watch
```

**Database Isolation**: Tests use separate `users_test` and `blogs_test` databases to ensure complete isolation from development and production data. See [TESTING.md](TESTING.md) for details.

## 📁 Project Structure

```
blog_roles_perms/
├── gateway/              # API Gateway (Express)
│   ├── src/
│   │   ├── middleware/  # Auth, rate limit, audit, etc.
│   │   └── proxy/       # Service proxies
│   └── README.md
├── services/
│   ├── authn/           # Authentication service
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── prisma/
│   └── blog/            # Blog service
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── src/authz/   # Authorization logic
│       └── prisma/
├── frontend/            # SvelteKit frontend
│   └── src/
├── shared/              # Shared types
└── docker-compose.yml   # PostgreSQL databases
```

## 🔑 API Gateway Routes

### Authentication (`/v1/auth`)

- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - Login (returns JWT)
- `GET /v1/auth/me` - Get current user
- `GET /v1/auth/admin-only` - Admin endpoint

### Blog (`/v1`)

All require `Authorization: Bearer <token>` header

#### Articles

- `POST /v1/articles` - Create article
- `GET /v1/articles` - List articles
- `PATCH /v1/articles/:id` - Update article
- `DELETE /v1/articles/:id` - Delete article

#### Comments

- `POST /v1/articles/:articleId/comments` - Create comment
- `GET /v1/articles/:articleId/comments` - List comments
- `PATCH /v1/comments/:id` - Update comment
- `DELETE /v1/comments/:id` - Delete comment

## 🚦 CI/CD

All pull requests require tests to pass before merging:

- ✅ 73 tests must pass (Gateway, Authn, Blog)
- ✅ Automated via GitHub Actions
- ✅ Test databases isolated from dev/prod

See [CI_CD.md](CI_CD.md) for workflow details and branch protection setup.

## 📚 Documentation

- [README.md](README.md) - Main documentation (this file)
- [TESTING.md](TESTING.md) - Testing guide and setup
- [TEST_SUMMARY.md](TEST_SUMMARY.md) - Test coverage details
- [CI_CD.md](CI_CD.md) - CI/CD configuration
- [gateway/README.md](gateway/README.md) - Gateway documentation
- [gateway/IMPLEMENTATION.md](gateway/IMPLEMENTATION.md) - Gateway implementation details

---

## DB Stuff

> connect to db from host:
> `psql -h localhost -p 5432 -U postgres -d users` or `psql -h localhost -p 5432 -U postgres -d blogs`
> local pw is usually `password`

> show all tables in db:
> `\dt` in psql console after connecting to db

> query all users:
> `SELECT * FROM users;` in psql console after connecting to db

> cleanup junk data after running tests
> `DELETE FROM "Article"
WHERE "createdAt" > '2026-02-01 00:00:00';`

---

## Run tests

# Run all tests

pnpm test or pnpm vitest in services/blog

# Run only authz (unit) tests

pnpm vitest run src/authz/**tests**/

# Run only integration tests

pnpm vitest run tests/integration/

---

## Blog Service

.service creates the data object in db
.controller handles http request via express
.routes directs traffic from routes > controller > service

Problems:

- Avoiding reliance on Grok or GPT, in favor of source docs. Moving slow to understand the nuts and bolts rather than vibe a function first product with AI.
- Incongruency of node syntax ie require vs import. Variance between what Prisma, Express, and Node each want.
- Issues with JWT - in particular iat. Attempting to ping /me with token generated after /login was throwing `invalid or expired token` error. Thought problem was due to clockdrift, however, problem was bc dotenv.config() only runs in index.ts, and middleware reads process.env.JWT_SECRET at module load time, before dotenv has been initialized, so verification always fails. In index.ts
  dotenv.config();
  const JWT_SECRET = process.env.JWT_SECRET!;
  ✅ dotenv is loaded before reading the secret
  ✅ JWT signing works

In auth.middleware.ts
const JWT_SECRET = process.env.JWT_SECRET!;
❌ This file is imported before dotenv.config() runs
❌ JWT_SECRET === undefined
❌ jwt.verify() fails signature check every time

to fix, created env bootstrap file to load dotenv once, early, everywhere
`// src/env.ts
import dotenv from "dotenv";
dotenv.config();`

- prisma config with adapters, node versions, are all very particular. also read errors and manually search network feedback. listen to editor errors and solve manually. had missing fields that editor noticed, but grok can't notice bc not aware of schema structure. api fields need to match schema.

CONNECT EXISTING DATABASE:

1. Configure your DATABASE_URL in prisma.config.ts
2. Run prisma db pull to introspect your database.

---

### Where was I?

- left off 260203 added integration tests for route accessing and permissions behaviors. Adds test db via docker. Test data is deleted after testing. began gateway setup.
- left off 260130 created policy matrix. developed types and fixtures. broke testing apart into matrices, test runner, and test files.
- left off 260128 (hbd mom !69!). Adds authenticate middleware to blog. Consumes authenticate in blog routes. Enforces authz in articles controller. Wrote a lot of good documentation to test authz. Enforces authz on comment create, edit and delete.
- left off 260127 added comments and articels tests into services/blog/src/authz/**tests**. installed vitest in blog service.
- left off 260122 refactored authn service to match architecture of blog service. updated blog service to use index barrels. updated ts in blogs service to match strictness of authn ts. Updated imports and cleaned up types across blog and auth. Removed vestigial code. Manually tested authn imports. Began first steps of authz.
- left off 260113 updated authn schema permissionLevel -> role. Handles registration and errors on frontend. Created blog service branch.
- left off 260112 conditionally rendering edit and delete buttons based on poster id. auth.user info persisting bc addition of (browser) block in store.
- left off 260108 with most basic ui setup. posts and comments render with dummy data.
- left off 260107 able to login succesfully
- left off 251230 11:45a CST at grok step 4: login page. need to implement src/routes/login/+page.svelte

---

---

### To do:

- wire frontend
  - add destructive actions/mutations abilities to frontend buttons.
    -- ✅ create article
    -- create comment
    -- delete comment
    -- delete article
    -- edit article + UI
    --- click edit button -> setState isEditingArticle(articleId) -> conditional render textarea when isEditingArticle is true -> on submit send PATCH request and set isEditingArticle false
    -- edit comment + ui
    -- write tests to prove users can't perform destructive actions without correct role/perm
    --- unit test api functions
    --- integration test button interactions
    --- e2e test all user paths in blog
- all routes should be accessed via .env rather than hardcoded http//:3000 or whatever
- write unit tests for frontend auth.api and blog.api
- consider replacing "if (browser)" for routes/api/me for auth
- refactor /login and /register to use sveltekit 5 form actions pattern
- resolve home / route to /blog
- deploy to prod
- add mobile react native fe service
- Refactor type references to use canonical shared types
- normalize error semantics
  -- 401 → unauthenticated, 403 → authenticated but forbidden, 404 → resource does not exist (don’t leak ownership!)
- Add integration tests for 403/401
- Add API gateway middleware using requirePermission
- refactor runMatrixPolicyTests to be generic + type-safe
- wire requirePermission() using these same policies
- ✅update schema mapping - model and table should be similar (users becomes user). First update schema, then run migrations, then change references throughout app.
- ✅ clean up authn/index.ts - unused requests and imports
- ✅ what is authn/script.ts doing?
- ✅ investigate if env.ts is actually doing anything in authn/src and blog/src. consider removing.
- ✅ do i need react style store + reducer to track authz state of application? something like that would accelerate dev time, but not sure if best practice. is best practice to just read user level from db? does that query get run every time to read permissions, or stored in and read from jwt? -- using (browser) block in store to handle this.
- ✅ refactor schema.prisma for correct role shapes. update permissionLevel to role, and only have two options USER and ADMIN
- ✅ create registration ui page
- ✅ create registration + authn functionality
- ✅ use index files to simplify import, especially in controllers, routes, and services directories
- ✅ 260130 wire authz into blog service controllers - enforce authz at service layer
  -- ✅ inject user context into blog controllers
  -- ✅ enforce authz in destructive routes
- ✅ 260130 build out functionality to demonstrate differences in authn and authz
- ✅ create blog service
- ✅ setup db with blogs and comments entities
- ✅ allow users to submit blog posts
- ✅ allow users to comment on blog posts
- ✅ allow users to delete their own blog posts
- ✅ allow users to edit their own blog posts
- ✅ allow users to delete their own comments
- ✅ allow users to edit their comments
- ✅ allow admins to delete blog posts and comments
- ✅ 260130 (Bob, Alice, admin) create dummy users - probably not doing this bc of how login sessions are set up. not interested in deconstructing this to use dummy data. maybe good exercise to understand authn deeply. idk yet.
- ✅ 260130 enforce authz on comment edit and delete
  ✅- add integration tests (at request level)
  -- proves authn works, authz is enforced, controllers are wired correctly
- ✅ Add audit logging (one line!)
- ✅ introduce API gateway
  -- Once services enforce authz correctly, tokens are trusted, and errors are consistent, then build the gateway to validate JWT once,
  inject x-user-id and x-user-role, forward to services, centralize CORS and rate limiting
- ✅ add authn integration tests
- ✅ refactor authn to use separate app and index files
- ✅ add root level pnpm test all capability
- ✅ entered password should not be visible in network call - check if this is still an issue after deployed to prod
- ✅ add integration tests as pre merge hook in ci/cd

---
