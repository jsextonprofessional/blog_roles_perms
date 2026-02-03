import { afterEach, afterAll } from "vitest";
import { truncateAllTables, testPrisma } from "../blog/src/db/index.js";

afterEach(async () => {
  await truncateAllTables();
});

afterAll(async () => {
  await testPrisma.$disconnect();
});
