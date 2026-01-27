import { UserContext, OwnableResource } from "./types.js";

export function canCreateArticle(_user: UserContext) {
  return true;
}

export function canEditArticle(user: UserContext, article: OwnableResource) {
  return article.authorId === user.id;
}

export function canDeleteArticle(user: UserContext, article: OwnableResource) {
  return article.authorId === user.id || user.role === "ADMIN";
}
