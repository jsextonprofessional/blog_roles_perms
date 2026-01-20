import { prisma } from "../lib/prisma";

export async function getArticles() {
  return await prisma.article.findMany();
}
