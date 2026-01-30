export type UserContext = {
  id: string;
  role: "USER" | "ADMIN";
};

export type OwnableResource = {
  authorId: string;
};

export type Actor = "owner" | "otherUser" | "admin" | "unauthenticated";

export type Action = "create" | "edit" | "delete";

export type PolicyFn<TResource = void> = TResource extends void
  ? (user: UserContext | null) => boolean
  : (user: UserContext | null, resource: TResource) => boolean;

export type PolicyMatrix = Record<Action, Record<Actor, boolean>>;
