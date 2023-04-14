import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "~/server/api/helpers/filterUserForClient";
import { TRPCError } from "@trpc/server";

import type { Post } from "@prisma/client";
export const bindUserDataToPosts = async (posts: Post[]) => {
  const userId = posts.map((post) => post.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
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
        message: `User not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }
    if (!userWithPost.username) {
      if (!userWithPost.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no Github or Google account: ${userWithPost.authorId}`,
        });
      }
      userWithPost.username = userWithPost.externalUsername;
    }
    return {
      ...post,
      ...userWithPost,
      username: userWithPost.username ?? "(username not found)",
    };
  });
  return postsWithUsers;
};
