A blog app written in SvelteKit, NodeJS, Express, Prisma.
The goal is to demonstrate proficiency in API Gateways + Microservices, Authentication, Authorization (roles and permissions)
App allows CRUD of blog posts and comments. There are three levels of users - READER, WRITER, EDITOR, each with elevating privilege of access and features.

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

- left off 260107 able to login succesfully
- left off 251230 11:45a CST at grok step 4: login page. need to implement src/routes/login/+page.svelte

To do:

- build out functionality to demonstrate differences in authn and authz
