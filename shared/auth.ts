export type AuthenticatedUser = {
  id: string;
  role: "USER" | "ADMIN";
};

export const USER_CONTEXT_HEADER = "x-user-context";
