import { TRPCError } from "@trpc/server";
import type { User } from "@clerk/nextjs/dist/api";

export const findExternalAccountUsernameOrThrowError = (user: User) => {
  const { id, profileImageUrl, username, externalAccounts } = user;
  if (!username || typeof username !== "string") {
    const externalUsername = externalAccounts.find((externalAccount) => {
      return (
        externalAccount.provider === "oauth_github" ||
        externalAccount.provider === "oauth_discord"
      );
    })?.username;
    if (!externalUsername) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `user not found, userId: ${id}`,
      });
    } else {
      return {
        authorId: id,
        profileImageUrl,
        username: externalUsername,
      };
    }
  }
  return {
    authorId: id,
    profileImageUrl,
    username,
  };
};
