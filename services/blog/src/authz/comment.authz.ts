import { UserContext, OwnableResource } from "./types.js";

export function canCreateComment(_user: UserContext) {
  return true;
}

export function canEditComment(user: UserContext, comment: OwnableResource) {
  return comment.authorId === user.id;
}

export function canDeleteComment(user: UserContext, comment: OwnableResource) {
  return comment.authorId === user.id || user.role === "ADMIN";
}
