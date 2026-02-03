import request from "supertest";
import { App } from "supertest/types";

export async function createArticle(
  app: App,
  token: string,
  data = { title: "Test title", content: "Test content" },
) {
  const response = await request(app)
    .post("/v1/articles")
    .set("Authorization", `Bearer ${token}`)
    .send(data);

  return response;
}
