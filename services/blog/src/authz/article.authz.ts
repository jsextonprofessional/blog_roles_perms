import { UserContext, OwnableResource, PolicyFn } from "./types.js";

export const canCreateArticle: PolicyFn = (user: UserContext | null) => {
  if (!user) return false;
  return user.role === "USER" || user.role === "ADMIN";
};

export const canEditArticle: PolicyFn<OwnableResource> = (
  user: UserContext | null,
  article: OwnableResource,
) => {
  if (!user) return false;
  return article.authorId === user.id;
};

export const canDeleteArticle: PolicyFn<OwnableResource> = (
  user: UserContext | null,
  article: OwnableResource,
) => {
  if (!user) return false;
  return article.authorId === user.id || user.role === "ADMIN";
};
