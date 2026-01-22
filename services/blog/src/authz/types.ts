export type UserContext = {
  id: string;
  role: "USER" | "ADMIN";
};

export type OwnableResource = {
  authorId: string;
};
