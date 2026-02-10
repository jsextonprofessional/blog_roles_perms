# Testing Guide

## Test Database Setup

All tests run against dedicated test databases to ensure complete isolation from development and production data.

### Database Configuration

- **Authn Service**: `users_test` on port 5432
- **Blog Service**: `blogs_test` on port 5433
- **Gateway**: No database (proxies to services)

### Test Database Creation

Test databases are created automatically in Docker containers. If you need to recreate them:

```bash
# Create test databases
docker exec -i blog_roles_perms-users-db-1 psql -U postgres -c "CREATE DATABASE users_test"
docker exec -i blog_roles_perms-blogs-db-1 psql -U postgres -c "CREATE DATABASE blogs_test"

# Run migrations for test databases
cd services/authn
DATABASE_URL="postgresql://postgres:password@localhost:5432/users_test" pnpm prisma migrate deploy

cd ../blog
DATABASE_URL="postgresql://postgres:password@localhost:5433/blogs_test" pnpm prisma migrate deploy
```

### Environment Files

Each service has a `.env.test` file that configures test-specific settings:

- `services/authn/.env.test` - Uses `users_test` database
- `services/blog/.env.test` - Uses `blogs_test` database
- `gateway/.env.test` - Test JWT secret

### Running Tests

```bash
# Run all tests across monorepo
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific service
cd services/authn
pnpm test:run

cd services/blog
pnpm test:run

cd gateway
pnpm test:run
```

## Test Coverage

### Gateway (6 tests)

- Health check endpoint
- Rate limiting middleware
- JWT authentication (valid/invalid/expired tokens)
- Audit logging

### Authn Service (20 tests)

- User registration (with/without admin role)
- Login authentication
- Password validation
- JWT token generation
- Protected endpoints (`/me`)
- Admin role enforcement
- Health check

### Blog Service (integration tests)

- Article CRUD operations
- Comment CRUD operations
- Authorization enforcement
- Ownership validation

## Test Data Isolation

Tests use several strategies to ensure data isolation:

1. **Separate Databases**: All tests run against `*_test` databases
2. **Test Prefixes**: Test users have emails starting with `test-`
3. **Cleanup Hooks**: `beforeEach` hooks delete test data
4. **Warning System**: Tests warn if DATABASE_URL doesn't contain 'test'

## Adding New Tests

When adding tests to a service:

1. Place integration tests in `tests/integration/`
2. Import `createApp()` from `src/app.js`
3. Use `beforeEach` to clean up test data
4. Ensure test data uses recognizable prefixes (`test-` for emails)

Example:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";

const app = createApp();

describe("My Feature", () => {
  beforeEach(async () => {
    // Clean up test data
  });

  it("should work correctly", async () => {
    const response = await request(app).get("/endpoint");
    expect(response.status).toBe(200);
  });
});
```
