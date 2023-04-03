import { TRPCError } from "@trpc/server";
import { type User } from "@clerk/nextjs/dist/server/clerk";

export const filterUserForClient = (user: User) => {
  const { id, profileImageUrl, username } = user;
  const errorMessage = `user not found`;
  if (typeof username !== "string")
    throw new TRPCError({ code: "NOT_FOUND", message: errorMessage });
  return { authorId: id, profileImageUrl, username };
};
