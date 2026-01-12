A blog app written in SvelteKit, NodeJS, Express, Prisma.

🎯 The goal is to demonstrate proficiency in API Gateways + Microservices, Authentication + Authorization (roles and permissions)

App allows CRUD of blog posts and comments. There are four levels of users -
1 guest
2 user
3 author
4 admin
each with elevating privilege of access and features.

---

to run docker:
`docker desktop start` and `docker compose up` in root of blog_roles_perms
-- should see "Starting Docker Desktop", "Attaching to blogs-db-1, users-db-1..."

to run authn:
`pnpm dev` in services/authn

to run frontend:
`pnpm run dev --open` in blog_roles_perms/frontend

---

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

Where was I?

- left off 260112 conditionally rendering edit and delete buttons based on poster id. auth.user info persisting bc addition of (browser) block in store.
- left off 260108 with most basic ui setup. posts and comments render with dummy data.
- left off 260107 able to login succesfully
- left off 251230 11:45a CST at grok step 4: login page. need to implement src/routes/login/+page.svelte

To do:

- refactor schema.prisma for correct role shapes. update permissionLevel to role, and only have two options USER and ADMIN
- add destructive actions/mutations abilities to frontend buttons.
- create dummy users - probably not doing this bc of how login sessions are set up. not interested in deconstructing this to use dummy data. maybe good exercise to understand authn deeply. idk yet.
- consider replacing "if (browser)" for routes/api/me for auth
- refactor /login to use sveltekit 5 form actions pattern
- resolve home / route to /blog
- build out functionality to demonstrate differences in authn and authz
- ✅ do i need react style store + reducer to track authz state of application? something like that would accelerate dev time, but not sure if best practice. is best practice to just read user level from db? does that query get run every time to read permissions, or stored in and read from jwt? -- using (browser) block in store to handle this.
