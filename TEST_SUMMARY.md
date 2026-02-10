# Test Database Summary

## Overview

All tests now run against dedicated test databases with complete isolation from dev/prod data.

## Test Databases

| Service | Database | Port | Test DB    | Connection String                                        |
| ------- | -------- | ---- | ---------- | -------------------------------------------------------- |
| Authn   | users    | 5432 | users_test | postgresql://postgres:password@localhost:5432/users_test |
| Blog    | blogs    | 5433 | blogs_test | postgresql://postgres:password@localhost:5433/blogs_test |
| Gateway | N/A      | N/A  | N/A        | No database (proxies only)                               |

## Test Coverage

### Gateway (6 tests)

- ✅ Health check endpoint
- ✅ Rate limiting middleware (100 req/min)
- ✅ Valid JWT token authentication
- ✅ Invalid JWT token rejection
- ✅ Expired JWT token rejection
- ✅ Audit logging with request IDs

### Authn Service (20 tests)

**Registration (6 tests)**

- ✅ Register new user successfully
- ✅ Hash password securely (bcrypt)
- ✅ Register with ADMIN role
- ✅ Validate required fields
- ✅ Prevent duplicate email
- ✅ Return JWT token on registration

**Login (6 tests)**

- ✅ Login with correct credentials
- ✅ Return valid JWT token
- ✅ Reject incorrect password
- ✅ Reject non-existent email
- ✅ Include user data in response
- ✅ Exclude password hash from response

**Protected Endpoints (4 tests)**

- ✅ Access /me with valid token
- ✅ Reject /me without token
- ✅ Reject /me with invalid token
- ✅ Reject /me with expired token

**RBAC (3 tests)**

- ✅ Allow admin to access admin-only endpoint
- ✅ Reject regular user from admin-only endpoint
- ✅ Reject unauthenticated request

**Health Check (1 test)**

- ✅ Return 200 for health check

### Blog Service (47 tests)

**Authorization Unit Tests (24 tests)**

- ✅ Article policies: create, read, update, delete (12 tests)
- ✅ Comment policies: create, read, update, delete (12 tests)

**Integration Tests (23 tests)**

- ✅ Articles CRUD with ownership validation (11 tests)
- ✅ Comments CRUD with ownership validation (12 tests)

## Test Data Isolation

### Strategies

1. **Separate Databases**: `users_test` and `blogs_test`
2. **Test Prefixes**: Test users have emails starting with `test-`
3. **Cleanup Hooks**: `beforeEach` deletes test data
4. **Warning System**: Alerts if DATABASE_URL doesn't contain 'test'

### Verification

```bash
# Check test database is empty after tests
docker exec -i blog_roles_perms-users-db-1 psql -U postgres -d users_test -c "SELECT COUNT(*) FROM \"User\""
# Result: 0 rows (tests clean up after themselves)

# Check dev database has separate data
docker exec -i blog_roles_perms-users-db-1 psql -U postgres -d users -c "SELECT COUNT(*) FROM \"User\""
# Result: 5+ rows (development data intact)
```

## Running Tests

```bash
# All tests across monorepo
pnpm test

# Individual service
cd gateway && pnpm test:run
cd services/authn && pnpm test:run
cd services/blog && pnpm test:run

# Watch mode
pnpm test:watch
```

## Test Results Summary

```
Gateway:  6/6 passed ✅
Authn:   20/20 passed ✅
Blog:    47/47 passed ✅
Total:   73/73 passed ✅
```

## CI/CD Integration

Tests are ready for CI/CD integration:

- ✅ Use dedicated test databases
- ✅ Clean up after themselves
- ✅ Run independently (can be parallelized)
- ✅ Fast execution (~8 seconds total)
- ✅ No external dependencies beyond Docker PostgreSQL

Next step: Add to pre-merge hooks or GitHub Actions workflow.
