import { afterAll } from "vitest";
import { truncateAllTables, testPrisma } from "../blog/src/db/index.js";

afterAll(async () => {
  await truncateAllTables();
});

afterAll(async () => {
  await testPrisma.$disconnect();
});
