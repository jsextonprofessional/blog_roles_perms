import { UserContext } from "../types.js";

export const user1: UserContext = { id: "user-1", role: "USER" };
export const user2: UserContext = { id: "user-2", role: "USER" };
export const admin: UserContext = { id: "admin-1", role: "ADMIN" };
export const unauthenticated = null;

export const articleByUser1 = { authorId: user1.id };
export const articleByUser2 = { authorId: user2.id };
export const commentByUser1 = { authorId: user1.id };
export const commentByUser2 = { authorId: user2.id };

export const ACTORS = {
  owner: user1,
  otherUser: user2,
  admin,
  unauthenticated,
};
