import { UserContext, OwnableResource, PolicyFn } from "./types.js";

export const canCreateComment: PolicyFn = (user: UserContext | null) => {
  if (!user) return false;
  return user.role === "USER" || user.role === "ADMIN";
};

export const canEditComment: PolicyFn<OwnableResource> = (
  user: UserContext | null,
  comment: OwnableResource,
) => {
  if (!user) return false;
  return comment.authorId === user.id;
};

export const canDeleteComment: PolicyFn<OwnableResource> = (
  user: UserContext | null,
  comment: OwnableResource,
) => {
  if (!user) return false;
  return comment.authorId === user.id || user.role === "ADMIN";
};
