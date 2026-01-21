import { prisma } from "../lib/prisma";

export async function createArticle(data: {
  title: string;
  content: string;
  authorId: string;
}) {
  return await prisma.article.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
    },
  });
}

export async function getArticles() {
  return await prisma.article.findMany();
}

export async function updateArticle(
  id: string,
  data: { title?: string; content?: string },
) {
  return await prisma.article.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

export async function deleteArticle(id: string) {
  return await prisma.article.delete({
    where: { id },
  });
}
