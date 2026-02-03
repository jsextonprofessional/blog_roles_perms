A blog app written in SvelteKit, NodeJS, Express, Prisma.

🎯 The goal is to demonstrate proficiency in API Gateways + Microservices, Authentication + Authorization (roles and permissions)

App allows CRUD of blog posts and comments. There are four levels of users -
1 guest - !authenticated
2 user
3 author - derived by matching user.id to postId or commentId
4 admin
each with elevating privilege of access and features.

---

to run docker:
`docker desktop start` and `docker compose up` in root of blog_roles_perms

should see "Starting Docker Desktop", "Attaching to blogs-db-1, users-db-1..."

to run authn:

`pnpm dev` in services/authn

to run frontend:

`pnpm run dev --open` in blog_roles_perms/frontend

to run migrations:

`pnpm prisma migrate dev` in services/authn

to generate types:

`rm -rf generated` in services/authn, then `pnpm prisma generate`

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

- left off 260203 added integration tests for route accessing and permissions behaviors. Adds test db via docker. Test data is deleted after testing.
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

- Add integration tests for 403/401
- add integration tests as pre merge hook in ci/cd
- Add API gateway middleware using requirePermission
- Add audit logging (one line!)
- refactor runMatrixPolicyTests to be generic + type-safe
- wire requirePermission() using these same policies
- add integration tests (at request level)
  -- proves authn works, authz is enforced, controllers are wired correctly
- normalize error semantics
  -- 401 → unauthenticated, 403 → authenticated but forbidden, 404 → resource does not exist (don’t leak ownership!)
- introduce API gateway
  -- Once services enforce authz correctly, tokens are trusted, and errors are consistent, then build the gateway to validate JWT once,
  inject x-user-id and x-user-role, forward to services, centralize CORS and rate limiting
- wire frontend
  -- Frontend becomes easy when URLs are stable, auth flows are real, permissions are enforced server-side. SvelteKit can then optimistically render buttons, rely on 403 responses, and hide controls via role (UX only)
  -- write tests to prove users can't perform destructive actions without correct role/perm
- add destructive actions/mutations abilities to frontend buttons.
- consider replacing "if (browser)" for routes/api/me for auth
- refactor /login and /register to use sveltekit 5 form actions pattern
- resolve home / route to /blog
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

---
