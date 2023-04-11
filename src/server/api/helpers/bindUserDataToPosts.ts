import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "~/server/api/helpers/filterUserForClient";
import { TRPCError } from "@trpc/server";

import type { Post } from "@prisma/client";
export const bindUserDataToPosts = async (posts: Post[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  const postsWithUsers = posts.map((post) => {
    const userWithPost = users.find((user) => {
      return user.authorId === post.authorId;
    });

    if (!userWithPost) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User not found",
      });
    } else {
      return { ...post, ...userWithPost };
    }
  });
  return postsWithUsers;
};
