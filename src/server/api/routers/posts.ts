import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const filterUserForClient = (user: User) => {
  const { id, profileImageUrl, username } = user;
  return { authorId: id, profileImageUrl, username };
};

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 1 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
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
  create: privateProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, { message: "Post must contain at least 1 character(s)" })
          .max(255, { message: "Post must contain at max 255 character(s)" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You exceeded the limit of 1 post per 10 seconds",
        });
      const { content } = input;

      const post = await ctx.prisma.post.create({
        data: { content, authorId },
      });
      return post;
    }),
});
