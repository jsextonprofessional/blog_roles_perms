import request from "supertest";
import { App } from "supertest/types";

export async function createCommentForArticle(
  app: App,
  articleId: string,
  token: string,
  content = "Test comment",
) {
  const response = await request(app)
    .post(`/v1/articles/${articleId}/comments`)
    .set("Authorization", `Bearer ${token}`)
    .send({ content });
  return response;
}
