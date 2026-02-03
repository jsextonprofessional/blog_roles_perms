import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { generateTestToken } from "./helpers.js";
import { alice, bob, admin } from "../fixtures.js";
import { createArticle, createCommentForArticle } from "./setup/index.js";

const app = createApp();

describe("Comments integration authz", () => {
  const aliceToken = generateTestToken(alice);
  const bobToken = generateTestToken(bob);
  const adminToken = generateTestToken(admin);

  let articleId: string;
  let commentOneId: string;
  let commentTwoId: string;

  beforeAll(async () => {
    const articleResponse = await createArticle(app, aliceToken, {
      title: "Article for Comments",
      content: "Content to comment on",
    });

    articleId = articleResponse.body.article.id;

    commentOneId = (
      await createCommentForArticle(app, articleId, bobToken, "Bob's comment")
    ).body.comment.id;

    commentTwoId = (
      await createCommentForArticle(
        app,
        articleId,
        aliceToken,
        "Alice's comment",
      )
    ).body.comment.id;
  });

  it("allows authenticated users to view comments", async () => {
    const response = await request(app)
      .get(`/v1/articles/${articleId}/comments`)
      .set("Authorization", `Bearer ${bobToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.comments)).toBe(true);
  });

  it("prevents unauthenticated users from viewing comments", async () => {
    const response = await request(app).get(
      `/v1/articles/${articleId}/comments`,
    );

    expect(response.status).toBe(401);
  });
  it("allows authenticated users to post comments", async () => {
    const response = await createCommentForArticle(
      app,
      articleId,
      bobToken,
      "Another comment from Bob",
    );

    expect(response.status).toBe(201);
    expect(response.body.comment).toHaveProperty("id");
    expect(response.body.comment.content).toBe("Another comment from Bob");
  });

  it("prevents unauthenticated users from posting comments", async () => {
    const response = await createCommentForArticle(
      app,
      articleId,
      "",
      "Anonymous comment",
    );

    expect(response.status).toBe(401);
  });

  it("allows comment author to edit own comment", async () => {
    const response = await request(app)
      .patch(`/v1/comments/${commentOneId}`)
      .set("Authorization", `Bearer ${bobToken}`)
      .send({
        content: "Edited comment from Bob",
      });

    expect(response.status).toBe(200);
    expect(response.body.comment.content).toBe("Edited comment from Bob");
  });

  it("prevents users from editing other user's comments", async () => {
    const response = await request(app)
      .patch(`/v1/comments/${commentOneId}`)
      .set("Authorization", `Bearer ${aliceToken}`)
      .send({
        content: "Alice trying to edit Bob's comment",
      });

    expect(response.status).toBe(403);
  });

  it("prevents admin from editing other user's comments", async () => {
    const response = await request(app)
      .patch(`/v1/comments/${commentOneId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        content: "Admin trying to edit Bob's comment",
      });

    expect(response.status).toBe(403);
  });

  it("prevents unauthenticated users from editing comments", async () => {
    const response = await request(app)
      .patch(`/v1/comments/${commentOneId}`)
      .send({
        content: "Anonymous edit attempt",
      });

    expect(response.status).toBe(401);
  });

  it("allows comment author to delete own comment", async () => {
    const response = await request(app)
      .delete(`/v1/comments/${commentTwoId}`)
      .set("Authorization", `Bearer ${aliceToken}`);

    expect(response.status).toBe(204);
  });

  it("prevents users from deleting other user's comments", async () => {
    const response = await request(app)
      .delete(`/v1/comments/${commentOneId}`)
      .set("Authorization", `Bearer ${aliceToken}`);

    expect(response.status).toBe(403);
  });

  it("allows admin to delete other user's comments", async () => {
    const response = await request(app)
      .delete(`/v1/comments/${commentOneId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(204);
  });

  it("prevents unauthenticated users from deleting comments", async () => {
    const response = await request(app).delete(`/v1/comments/${commentOneId}`);

    expect(response.status).toBe(401);
  });
});
