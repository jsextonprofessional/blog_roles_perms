import "../src/env.js";

// Set test-specific environment variables
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-for-authn-tests";

// Ensure we're using test database
if (!process.env.DATABASE_URL?.includes("test")) {
  console.warn(
    "⚠️  Warning: DATABASE_URL doesn't contain 'test'. Make sure you're using a test database!",
  );
}
