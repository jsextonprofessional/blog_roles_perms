import { prisma } from "../lib/prisma.js";

export async function createComment(data: {
  articleId: string;
  content: string;
  authorId: string;
}) {
  return await prisma.comment.create({
    data: {
      articleId: data.articleId,
      content: data.content,
      authorId: data.authorId,
    },
  });
}

export async function getCommentById(id: string) {
  return prisma.comment.findUnique({
    where: { id },
  });
}

export async function getCommentsByArticle(articleId: string) {
  return await prisma.comment.findMany({
    where: { articleId },
  });
}

export async function updateComment(id: string, data: { content?: string }) {
  return await prisma.comment.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

export async function deleteComment(id: string) {
  return await prisma.comment.delete({
    where: { id },
  });
}
