import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { generateTestToken } from "./helpers.js";
import { alice, bob, admin } from "./fixtures.js";

const app = createApp();

describe("Articles integration authz", () => {
  const aliceToken = generateTestToken(alice);
  const bobToken = generateTestToken(bob);
  const adminToken = generateTestToken(admin);

  let articleOneId: string;
  let articleTwoId: string;

  // can beforeAll be an imported helper? is this bad practice?
  beforeAll(async () => {
    // Alice creates two articles
    const responseOne = await request(app)
      .post("/v1/articles")
      .set("Authorization", `Bearer ${aliceToken}`)
      .send({
        title: "Alice Article",
        content: "Secret thoughts + musings",
      });

    articleOneId = responseOne.body.article.id;

    const responseTwo = await request(app)
      .post("/v1/articles")
      .set("Authorization", `Bearer ${aliceToken}`)
      .send({
        title: "Another Alice Article",
        content: "More secret thoughts",
      });

    articleTwoId = responseTwo.body.article.id;
  });

  it("allows anyone to view articles", async () => {
    const response = await request(app).get(`/v1/articles/`);

    expect(response.status).toBe(200);
  });

  it("allows authenticated users to create articles", async () => {
    const response = await request(app)
      .post("/v1/articles")
      .set("Authorization", `Bearer ${bobToken}`)
      .send({
        title: "Bob's First Article",
        content: "Hello world!",
      });

    expect(response.status).toBe(201);
    expect(response.body.article).toHaveProperty("id");
    expect(response.body.article.title).toBe("Bob's First Article");
  });

  it("prevents unauthenticated users from creating articles", async () => {
    const response = await request(app).post("/v1/articles").send({
      title: "Anonymous Article",
      content: "Should not be created",
    });

    expect(response.status).toBe(401);
  });

  it("allows authors to update their own articles", async () => {
    const response = await request(app)
      .patch(`/v1/articles/${articleOneId}`)
      .set("Authorization", `Bearer ${aliceToken}`)
      .send({
        title: "Updated Alice Article",
        content: "Updated content",
      });

    expect(response.status).toBe(200);
    expect(response.body.article.title).toBe("Updated Alice Article");
  });

  it("prevents users from updating another user's article", async () => {
    const response = await request(app)
      .patch(`/v1/articles/${articleOneId}`)
      .set("Authorization", `Bearer ${bobToken}`)
      .send({
        title: "Hacked Title",
        content: "Hacked content",
      });

    expect(response.status).toBe(403);
  });

  it("prevents admin from updating another user's article", async () => {
    const response = await request(app)
      .patch(`/v1/articles/${articleOneId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Admin Updated Title",
        content: "Admin updated content",
      });

    expect(response.status).toBe(403);
  });

  it("prevents unauthenticated users from updating articles", async () => {
    const response = await request(app)
      .patch(`/v1/articles/${articleOneId}`)
      .send({
        title: "Anonymous Update",
        content: "Should not be updated",
      });

    expect(response.status).toBe(401);
  });

  it("prevents unauthenticated users from deleting an article", async () => {
    const response = await request(app).delete(`/v1/articles/${articleOneId}`);

    expect(response.status).toBe(401);
  });

  it("prevents user from deleting another user's article", async () => {
    const response = await request(app)
      .delete(`/v1/articles/${articleOneId}`)
      .set("Authorization", `Bearer ${bobToken}`);

    expect(response.status).toBe(403);
  });

  it("allows author to delete their own article", async () => {
    const response = await request(app)
      .delete(`/v1/articles/${articleOneId}`)
      .set("Authorization", `Bearer ${aliceToken}`);

    expect(response.status).toBe(204);
  });

  it("allows admin to delete any article", async () => {
    const deleteResponse = await request(app)
      .delete(`/v1/articles/${articleTwoId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteResponse.status).toBe(204);
  });
});
