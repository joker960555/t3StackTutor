import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const filterUserForClient = (user: User) => {
  const { id, profileImageUrl, username } = user;
  return { authorId: id, profileImageUrl, username };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100 });
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

      if (!userWithPost || typeof userWithPost.username !== "string") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      } else {
        return { ...post, ...userWithPost, username: userWithPost.username };
      }
    });
    return postsWithUsers;
  }),
});
