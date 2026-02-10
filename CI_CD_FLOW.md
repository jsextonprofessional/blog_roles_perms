# CI/CD Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Developer Workflow                          │
└─────────────────────────────────────────────────────────────────────┘

  1. Developer creates feature branch
         │
         ├─── git checkout -b feature/new-feature
         │
  2. Makes changes & commits
         │
         ├─── git add .
         ├─── git commit -m "Add new feature"
         │
  3. Runs tests locally (optional but recommended)
         │
         ├─── pnpm test  ✅ 73 tests pass
         │
  4. Pushes branch & creates PR
         │
         └─── git push -u origin feature/new-feature


┌─────────────────────────────────────────────────────────────────────┐
│                      GitHub Actions Triggered                        │
└─────────────────────────────────────────────────────────────────────┘

  PR Created/Updated → Triggers Workflows
         │
         ├──────────────────────┬──────────────────────┐
         │                      │                      │
         ▼                      ▼                      ▼
  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │  Test Suite  │      │  Lint Check  │      │    Build     │
  │   Workflow   │      │   Workflow   │      │   Workflow   │
  └──────────────┘      └──────────────┘      └──────────────┘
         │                      │                      │
         ├─ Setup Node         ├─ Setup Node         ├─ Setup Node
         ├─ Install pnpm       ├─ Install pnpm       ├─ Install pnpm
         ├─ Cache deps         ├─ Install deps       ├─ Install deps
         ├─ Install deps       ├─ Run TypeScript     ├─ Run builds
         │                     │   type checks        │
         ├─ Start PostgreSQL   │                      └─ ✅ Success
         │   • users-db:5432   └─ ✅ Success
         │   • blogs-db:5433
         │
         ├─ Create test DBs
         │   • users_test
         │   • blogs_test
         │
         ├─ Run migrations
         │   • authn service
         │   • blog service
         │
         ├─ Execute tests
         │   ├─ Gateway:  6 tests ✅
         │   ├─ Authn:   20 tests ✅
         │   └─ Blog:    47 tests ✅
         │
         └─ Report results
              └─ ✅ 73/73 tests passed


┌─────────────────────────────────────────────────────────────────────┐
│                      Branch Protection Rules                         │
└─────────────────────────────────────────────────────────────────────┘

  All checks complete
         │
         ▼
  ┌─────────────────────────────────────┐
  │  Status Checks (on GitHub PR page)  │
  ├─────────────────────────────────────┤
  │  ✅ Run All Tests          PASSED   │
  │  ✅ Lint & Type Check      PASSED   │
  │  ✅ Build All Packages     PASSED   │
  │                                      │
  │  ✅ All checks have passed          │
  └─────────────────────────────────────┘
         │
         ├─── If ANY check fails:
         │    ❌ Merge button DISABLED
         │    ⚠️  "Required checks must pass"
         │    Developer must fix & push again
         │
         └─── If ALL checks pass:
              ✅ Merge button ENABLED
              ✅ Ready for review
              ✅ Ready to merge


┌─────────────────────────────────────────────────────────────────────┐
│                           Code Review                                │
└─────────────────────────────────────────────────────────────────────┘

  Reviewer examines PR
         │
         ├─── Reviews code changes
         ├─── Checks test results
         ├─── Verifies functionality
         │
         └─── Approves PR ✅


┌─────────────────────────────────────────────────────────────────────┐
│                            Merge to Main                             │
└─────────────────────────────────────────────────────────────────────┘

  Requirements met:
    ✅ All tests passed (73/73)
    ✅ Code review approved
    ✅ Conversations resolved
    ✅ Branch up to date
         │
         └─── Click "Merge pull request"
                    │
                    ▼
              ┌────────────┐
              │ main branch│ ← Feature merged ✅
              └────────────┘
                    │
                    └─── Tests run again on main
                         (verification push)


┌─────────────────────────────────────────────────────────────────────┐
│                         Key Benefits                                 │
└─────────────────────────────────────────────────────────────────────┘

✅ No broken code reaches main branch
✅ All changes are tested automatically
✅ Test databases isolated from dev/prod
✅ Fast feedback (~2-3 minutes)
✅ Consistent testing across all PRs
✅ Documented review process
✅ Prevents accidental direct pushes to main
✅ Easy to track test results in PR


┌─────────────────────────────────────────────────────────────────────┐
│                       Workflow Timing                                │
└─────────────────────────────────────────────────────────────────────┘

Step                          Time
────────────────────────────  ──────────────
Checkout & Setup              ~30 seconds
Install Dependencies          ~30-90 seconds (cached)
Start PostgreSQL              ~15 seconds
Create & Migrate Test DBs     ~20 seconds
Run All Tests                 ~10 seconds
Report Results                ~5 seconds
────────────────────────────  ──────────────
Total                         ~2-3 minutes


┌─────────────────────────────────────────────────────────────────────┐
│                     What Gets Protected                              │
└─────────────────────────────────────────────────────────────────────┘

main branch
    ├─ Cannot push directly (must use PR)
    ├─ Cannot merge without tests passing
    ├─ Cannot merge without code review
    ├─ Cannot merge with unresolved conversations
    └─ Cannot bypass rules (even admins)


┌─────────────────────────────────────────────────────────────────────┐
│                      Developer Experience                            │
└─────────────────────────────────────────────────────────────────────┘

Before Push:                  After Push:
├─ pnpm test (local)         ├─ Create PR on GitHub
├─ Fix any failures          ├─ Auto-triggered workflows
└─ Commit & push             ├─ View test results in PR
                              ├─ Fix if red, merge if green
                              └─ Merge with confidence ✅
```

## Test Execution Details

### Gateway Tests (6)

```
✓ Health check endpoint
✓ Rate limiting (100 req/min)
✓ Valid JWT authentication
✓ Invalid JWT rejection
✓ Expired JWT rejection
✓ Audit logging with request IDs
```

### Authn Tests (20)

```
✓ User registration (6 tests)
  - New user, admin role, validation, duplicates, JWT
✓ Login authentication (6 tests)
  - Valid/invalid credentials, JWT generation
✓ Protected endpoints (4 tests)
  - /me with valid/invalid/expired/missing tokens
✓ RBAC enforcement (3 tests)
  - Admin-only endpoint access control
✓ Health check (1 test)
```

### Blog Tests (47)

```
✓ Authorization policies (24 tests)
  - Article CRUD policies (12)
  - Comment CRUD policies (12)
✓ Integration tests (23 tests)
  - Articles with ownership (11)
  - Comments with ownership (12)
```
