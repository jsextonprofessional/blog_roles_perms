// Set test-specific environment variables before importing anything
process.env.NODE_ENV = "test";
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "test-jwt-secret-for-blog-tests";

// Override DATABASE_URL to use test database
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_TEST ||
  "postgresql://postgres:password@localhost:5433/blogs_test";

// Warn if DATABASE_URL doesn't indicate it's a test database
if (!process.env.DATABASE_URL?.includes("test")) {
  console.warn(
    "⚠️  Warning: DATABASE_URL doesn't contain 'test'. Make sure you're using a test database!",
  );
  console.warn(`   Current DATABASE_URL: ${process.env.DATABASE_URL}`);
}
