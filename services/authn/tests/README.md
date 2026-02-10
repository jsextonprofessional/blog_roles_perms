# Authentication Service Tests

Comprehensive integration tests for the authentication service covering user registration, login, JWT token management, and role-based access control.

## Test Coverage

### ✅ User Registration (`POST /v1/register`)

- Successfully creates new user with valid data
- Assigns default USER role when not specified
- Allows admin role assignment
- Returns valid JWT token
- Validates required fields (firstName, lastName, email, password)
- Prevents duplicate email registration
- Securely hashes passwords using bcrypt

### ✅ User Login (`POST /v1/login`)

- Successfully logs in with correct credentials
- Returns valid JWT token on successful login
- Rejects invalid passwords
- Rejects non-existent emails
- Validates required fields (email, password)

### ✅ Current User Info (`GET /v1/me`)

- Returns user info with valid JWT token
- Rejects requests without authentication token
- Rejects invalid JWT tokens
- Rejects expired JWT tokens

### ✅ Role-Based Access Control (`GET /v1/admin-only`)

- Allows admin users to access admin endpoints
- Denies regular users from accessing admin endpoints
- Requires authentication

### ✅ Health Check (`GET /health`)

- Returns healthy status for service monitoring

## Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run with coverage
pnpm test -- --coverage
```

## Test Database

⚠️ **Important**: Make sure to use a separate test database!

Set your test database in `.env`:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/users_test"
```

The test setup warns you if `DATABASE_URL` doesn't contain "test".

## Test Structure

```
tests/
├── setup.ts                           # Test environment setup
└── integration/
    └── auth.int.test.ts              # Authentication integration tests
```

The tests import `createApp()` directly from `src/app.ts`, which separates app creation from server startup. This matches the pattern used in the blog service.

## What Are Integration Tests?

These are **integration tests** (not unit tests) because they:

- Test the full HTTP request/response cycle
- Interact with the real database (via Prisma)
- Test multiple components working together:
  - Express routes
  - Controllers
  - Services
  - Database layer
  - JWT token generation and verification
  - Password hashing

## Key Testing Patterns

### 1. Database Cleanup

Tests clean up after themselves by deleting test users:

```typescript
beforeEach(async () => {
  await prisma.user.deleteMany({
    where: { email: { startsWith: "test-" } },
  });
});
```

### 2. JWT Token Testing

Tests verify JWT tokens are valid and contain correct claims:

```typescript
const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
expect(decoded).toHaveProperty("userId");
expect(decoded).toHaveProperty("role");
```

### 3. Password Security

Tests ensure passwords are hashed, not stored in plain text:

```typescript
const user = await prisma.user.findUnique({ where: { id: userId } });
expect(user?.passwordHash).not.toBe(password);
expect(user?.passwordHash).toMatch(/^\$2[aby]\$/); // bcrypt pattern
```

### 4. Error Cases

Tests cover both success and failure scenarios:

- Missing required fields
- Invalid credentials
- Expired tokens
- Insufficient permissions

## Dependencies

- **vitest** - Test framework
- **supertest** - HTTP request testing
- **@types/supertest** - TypeScript types
- **@vitest/ui** - Visual test UI (optional)

## Best Practices

1. ✅ Use descriptive test names
2. ✅ Test both success and error paths
3. ✅ Clean up test data after each test
4. ✅ Use separate test database
5. ✅ Test security features (password hashing, JWT validation)
6. ✅ Verify tokens and sensitive data handling
7. ✅ Test role-based access control

## Future Enhancements

- [ ] Add performance tests for password hashing
- [ ] Test rate limiting on login endpoint
- [ ] Add tests for concurrent registrations
- [ ] Test token refresh flow
- [ ] Add load testing for authentication endpoints
- [ ] Test password strength requirements
- [ ] Add tests for account lockout after failed attempts
