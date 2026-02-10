# Setting Up Branch Protection

## Quick Setup Guide

Follow these steps to require all tests to pass before merging PRs:

### Step 1: Push the Workflow Files

The workflow files are already created in `.github/workflows/`. Commit and push them:

```bash
git add .github/
git commit -m "Add CI/CD workflows for automated testing"
git push
```

### Step 2: Create a Test Pull Request

To verify workflows are working:

```bash
# Create a test branch
git checkout -b test-ci-setup

# Make a small change
echo "# Test CI" >> TEST_CI.md
git add TEST_CI.md
git commit -m "Test CI setup"
git push -u origin test-ci-setup
```

Then create a PR on GitHub to see the workflows run.

### Step 3: Configure Branch Protection

1. Navigate to: `https://github.com/jsextonprofessional/blog_roles_perms/settings/branches`

2. Click **"Add branch protection rule"**

3. Configure the following:

   **Branch name pattern:**

   ```
   main
   ```

   **Protect matching branches:**
   - ✅ Require a pull request before merging
     - Require approvals: `1`
     - Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - Search and add: **`Run All Tests`**
     - (Optional) Add: `Lint & Type Check`
     - (Optional) Add: `Build All Packages`
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

4. Click **"Create"** or **"Save changes"**

### Step 4: Verify Protection

Try to merge a PR without passing tests:

1. The merge button will be disabled
2. GitHub will show "Required status check 'Run All Tests' must pass"
3. Tests must complete successfully before merge is allowed

## What This Protects Against

✅ **Prevents:**

- Merging code that breaks tests
- Pushing directly to main without review
- Merging PRs with unresolved conversations
- Deploying code that hasn't been validated

✅ **Ensures:**

- All 73 tests pass before merge
- Code review is completed
- Changes are discussed and approved
- Test databases remain isolated

## Status Check Names

The workflows create these status checks:

- `Run All Tests` - Main test suite (required)
- `Lint & Type Check` - Code quality (optional)
- `Build All Packages` - Build validation (optional)

## Workflow Execution

When a PR is created or updated:

1. GitHub Actions automatically triggers
2. PostgreSQL test databases spin up
3. Dependencies install (cached after first run)
4. All 73 tests execute
5. Results appear in PR checks section
6. Green checkmark = can merge, Red X = cannot merge

## Troubleshooting

**Q: Status checks aren't appearing in branch protection settings**

- A: You need to run the workflow at least once. Create a test PR to trigger it.

**Q: Can't find "Run All Tests" in the status checks list**

- A: The workflow must complete at least once. Wait for the test PR workflow to finish.

**Q: Tests pass locally but fail in CI**

- A: Check the Actions logs. Common issues:
  - Missing environment variables
  - Database connection issues
  - Timing/race conditions

**Q: How do I bypass branch protection?**

- A: As a repo admin, you can temporarily disable the rule, but this defeats the purpose. Better to fix the failing tests.

## Next Steps

After setting up branch protection:

1. ✅ All contributors must create PRs for changes
2. ✅ Tests run automatically on every PR
3. ✅ Code review is required
4. ✅ Merge only happens when tests pass

Consider also adding:

- Code coverage requirements
- Automated dependency updates (Dependabot is already configured)
- Deployment workflows for staging/production
- Slack/Discord notifications for CI failures
