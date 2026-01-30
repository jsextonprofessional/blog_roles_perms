import { PolicyMatrix } from "../types.js";

export const COMMENT_POLICY_MATRIX: PolicyMatrix = {
  create: {
    owner: true,
    otherUser: true,
    admin: true,
    unauthenticated: false,
  },
  edit: {
    owner: true,
    otherUser: false,
    admin: false, // intentionally false - only owners can edit.
    unauthenticated: false,
  },
  delete: {
    owner: true,
    otherUser: false,
    admin: true,
    unauthenticated: false,
  },
} as const;
