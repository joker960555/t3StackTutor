// import { TRPCError } from "@trpc/server";
// import type { User } from "@clerk/nextjs/dist/server/clerk";
import type { User } from "@clerk/nextjs/dist/api";

export const filterUserForClient = (user: User) => {
  const { id, profileImageUrl, username } = user;
  // const errorMessage = `user not found`;
  // if (typeof username !== "string")
  //   throw new TRPCError({ code: "NOT_FOUND", message: errorMessage });
  return {
    authorId: id,
    profileImageUrl,
    username,
    externalUsername:
      user.externalAccounts.find(
        (externalAccount) =>
          externalAccount.provider === "oauth_github" ||
          externalAccount.provider === "oauth_google" ||
          externalAccount.provider === "oauth_discord"
      )?.username || null,
  };
};
