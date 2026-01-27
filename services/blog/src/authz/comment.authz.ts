import { UserContext, OwnableResource } from "./types.js";

export function canCreateComment(user: UserContext | null): boolean {
  if (!user) return false;

  return user.role === "USER" || user.role === "ADMIN";
}

export function canEditComment(user: UserContext, comment: OwnableResource) {
  return comment.authorId === user.id;
}

export function canDeleteComment(user: UserContext, comment: OwnableResource) {
  return comment.authorId === user.id || user.role === "ADMIN";
}
