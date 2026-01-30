export type UserContext = {
  id: string;
  role: "USER" | "ADMIN";
};

export type OwnableResource = {
  authorId: string;
};

export type Actor = "owner" | "otherUser" | "admin" | "unauthenticated";

export type Policy = "create" | "edit" | "delete";

export type PolicyMatrix = {
  [P in Policy]: {
    [A in Actor]: boolean;
  };
};
