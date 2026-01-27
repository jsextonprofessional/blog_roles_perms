import { describe, it, expect } from "vitest";
import {
  canCreateArticle,
  canDeleteArticle,
  canEditArticle,
} from "../article.authz.js";
import { UserContext } from "../types.js";

const user1: UserContext = { id: "user-1", role: "USER" };
const user2: UserContext = { id: "user-2", role: "USER" };
const admin: UserContext = { id: "admin-1", role: "ADMIN" };
const articleByUser1 = { authorId: user1.id };
const articleByUser2 = { authorId: user2.id };

describe("Article creation authorization", () => {
  it("allows authenticated user to create an article", () => {
    const result = canCreateArticle(user1);

    expect(result).toBe(true);
  });

  it("allows admin to create an article", () => {
    const result = canCreateArticle(admin);

    expect(result).toBe(true);
  });

  it("prevents unauthenticated user from creating an article", () => {
    // Assuming unauthenticated user is represented by null or undefined
    const result = canCreateArticle(null);

    expect(result).toBe(false);
  });
});

describe("Article edit authorization", () => {
  it("allows user to edit their own article", () => {
    const result = canEditArticle(user1, articleByUser1);

    expect(result).toBe(true);
  });

  it("prevents user from editing other user's article", () => {
    const result = canEditArticle(user1, articleByUser2);

    expect(result).toBe(false);
  });

  it("prevents admin from editing other user's article", () => {
    const result = canEditArticle(admin, articleByUser2);

    expect(result).toBe(false);
  });
});

describe("Article delete authorization", () => {
  it("allows user to delete their own article", () => {
    const result = canDeleteArticle(user1, articleByUser1);

    expect(result).toBe(true);
  });

  it("prevents user from deleting other user's article", () => {
    const result = canDeleteArticle(user1, articleByUser2);

    expect(result).toBe(false);
  });

  it("allows admin to delete any article", () => {
    const result = canDeleteArticle(admin, articleByUser2);

    expect(result).toBe(true);
  });
});
