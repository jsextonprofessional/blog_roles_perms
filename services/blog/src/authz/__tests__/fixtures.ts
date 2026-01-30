import { UserContext } from "../types.js";

const user1: UserContext = { id: "user-1", role: "USER" };
const user2: UserContext = { id: "user-2", role: "USER" };
const admin: UserContext = { id: "admin-1", role: "ADMIN" };
const unauthenticated = null;

const articleByUser1 = { authorId: user1.id };
const articleByUser2 = { authorId: user2.id };
const commentByUser1 = { authorId: user1.id };
const commentByUser2 = { authorId: user2.id };
