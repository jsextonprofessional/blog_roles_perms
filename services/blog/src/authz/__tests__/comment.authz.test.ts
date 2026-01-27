import { describe, it, expect } from "vitest";
import {
  canCreateComment,
  canEditComment,
  canDeleteComment,
} from "../comment.authz.js";
import { UserContext } from "../types.js";

const user1: UserContext = { id: "user-1", role: "USER" };
const user2: UserContext = { id: "user-2", role: "USER" };
const admin: UserContext = { id: "admin-1", role: "ADMIN" };
const commentByUser1 = { authorId: user1.id };
const commentByUser2 = { authorId: user2.id };

describe("Comment creation authorization", () => {
  it("allows any authenticated user to create a comment", () => {
    const result = canCreateComment(user1);

    expect(result).toBe(true);
  });

  it("allows admin to create a comment", () => {
    const result = canCreateComment(admin);

    expect(result).toBe(true);
  });

  it("prevents unauthenticated user from creating a comment", () => {
    // Assuming unauthenticated user is represented by null or undefined
    const result = canCreateComment(null);

    expect(result).toBe(false);
  });
});

describe("Comment edit authorization", () => {
  it("allows user to edit their own comment", () => {
    const result = canEditComment(user1, commentByUser1);

    expect(result).toBe(true);
  });

  it("prevents user from editing other user's comment", () => {
    const result = canEditComment(user1, commentByUser2);

    expect(result).toBe(false);
  });

  it("prevents admin from editing other user's comment", () => {
    const result = canEditComment(admin, commentByUser2);

    expect(result).toBe(false);
  });
});

describe("Comment delete authorization", () => {
  it("allows user to delete their own comment", () => {
    const result = canDeleteComment(user1, commentByUser1);

    expect(result).toBe(true);
  });

  it("prevents user from deleting other user's comment", () => {
    const result = canDeleteComment(user1, commentByUser2);

    expect(result).toBe(false);
  });

  it("allows admin to delete any comment", () => {
    const result = canDeleteComment(admin, commentByUser2);

    expect(result).toBe(true);
  });
});
