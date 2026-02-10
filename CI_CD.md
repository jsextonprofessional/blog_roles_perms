# CI/CD Configuration

## GitHub Actions Workflows

### Test Suite Workflow (`.github/workflows/test.yml`)

Runs on every pull request and push to main branch.

**What it does:**

1. Spins up PostgreSQL test databases (users_test, blogs_test)
2. Installs dependencies
3. Runs database migrations
4. Executes all 73 tests across the monorepo
5. Reports test results

**Status Badge:**
Add to README.md:

```markdown
![Test Suite](https://github.com/jsextonprofessional/blog_roles_perms/actions/workflows/test.yml/badge.svg)
```

### CI Workflow (`.github/workflows/ci.yml`)

Additional checks for code quality:

- Type checking with TypeScript
- Build validation for all packages

## Branch Protection Rules

To require tests to pass before merging, configure these settings in GitHub:

### Settings → Branches → Branch protection rules → Add rule

**Branch name pattern:** `main`

**Protection settings:**

- ✅ Require a pull request before merging
  - ✅ Require approvals: 1
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - **Status checks to require:**
    - `Run All Tests`
    - `Lint & Type Check` (optional)
    - `Build All Packages` (optional)
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

### How to Enable

1. Go to: `https://github.com/jsextonprofessional/blog_roles_perms/settings/branches`
2. Click "Add branch protection rule"
3. Enter `main` as the branch name pattern
4. Enable the checkboxes listed above
5. In "Status checks that are required", search for "Run All Tests"
6. Click "Create" or "Save changes"

## Pull Request Template

A PR template (`.github/PULL_REQUEST_TEMPLATE.md`) is included with:

- Description guidelines
- Type of change checklist
- Testing checklist
- Documentation reminder
- Issue linking

## Dependabot

Automated dependency updates are configured in `.github/dependabot.yml`:

- Weekly checks for npm packages
- Weekly checks for GitHub Actions versions
- Groups updates into production and development dependencies

## Local Development

Before pushing, ensure all checks will pass:

```bash
# Run all tests
pnpm test

# Type check (if configured)
pnpm -r exec tsc --noEmit

# Build all packages
pnpm build
```

## Workflow Triggers

### Test Suite

- ✅ Pull requests to `main`
- ✅ Direct pushes to `main`

### CI (Lint & Build)

- ✅ Pull requests to `main`
- ✅ Direct pushes to `main`

## Test Execution Time

Approximate workflow duration:

- Setup (Node, pnpm, dependencies): ~1-2 minutes
- Database setup & migrations: ~30 seconds
- Test execution: ~10 seconds
- **Total**: ~2-3 minutes

## Caching

The workflow uses pnpm store caching to speed up dependency installation:

- First run: ~2 minutes for install
- Cached runs: ~30 seconds for install

## Environment Variables

Tests run with:

- `NODE_ENV=test`
- `DATABASE_URL_TEST` set for each database
- `JWT_SECRET` set to test value

## Debugging Failed Workflows

If tests fail in CI:

1. **Check the workflow logs** in the Actions tab
2. **Reproduce locally** with the same database setup
3. **Verify test database isolation** - ensure tests aren't interfering
4. **Check for timing issues** - CI can be slower than local

Common issues:

- Database not ready → workflow has health checks
- Missing migrations → ensure all migrations are committed
- Environment variables → verify .env.test files

## Future Enhancements

Consider adding:

- [ ] Code coverage reporting (codecov.io)
- [ ] Performance benchmarks
- [ ] E2E tests with Playwright
- [ ] Docker image builds
- [ ] Deployment to staging/production
- [ ] Slack/Discord notifications
- [ ] Security scanning (Snyk, OWASP)
