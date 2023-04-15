import type { User } from "@clerk/nextjs/dist/api";
import { findExternalAccountUsernameOrThrowError } from "./findExternalAccountUsernameOrThrowError";

export const filterUserForClient = (user: User) => {
  const { id, profileImageUrl, username } = user;
  if (typeof username !== "string") {
    return findExternalAccountUsernameOrThrowError({ ...user, username });
  }
  return {
    authorId: id,
    profileImageUrl,
    username,
  };
};
