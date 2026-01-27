import { UserContext, OwnableResource } from "./types.js";

export function canCreateArticle(user: UserContext | null): boolean {
  if (!user) return false;

  return user.role === "USER" || user.role === "ADMIN";
}

export function canEditArticle(user: UserContext, article: OwnableResource) {
  return article.authorId === user.id;
}

export function canDeleteArticle(user: UserContext, article: OwnableResource) {
  return article.authorId === user.id || user.role === "ADMIN";
}
