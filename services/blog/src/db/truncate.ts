import testPrisma from "./testClient.js";

export async function truncateAllTables() {
  await testPrisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Article",
      "Comment",
      "User"
    RESTART IDENTITY
    CASCADE;
    `);
}
