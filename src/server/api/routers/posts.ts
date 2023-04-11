import { z } from "zod";
import { bindUserDataToPosts } from "~/server/api/helpers/bindUserDataToPosts";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// const filterUserForClient = (user: User) => {
//   const { id, profileImageUrl, username } = user;
//   return { authorId: id, profileImageUrl, username };
// };

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
    return await bindUserDataToPosts(posts);
  }),
  getUniquePostById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: { id },
      });
      return (await bindUserDataToPosts([post]))[0];
    }),
  getPostsByUserId: publicProcedure
    .input(
      z.object({ authorId: z.string(), skipCount: z.number().nonnegative() })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { authorId: { contains: input.authorId } },
        take: 11,
        orderBy: [{ createdAt: "desc" }],
        skip: input.skipCount,
      });
      if (!posts) throw new TRPCError({ code: "NOT_FOUND" });
      return await bindUserDataToPosts(posts);
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
  getInfinitePostsByUserId: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, authorId, limit, skip } = input;

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        where: { authorId: { contains: authorId } },
        orderBy: { createdAt: "desc" },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
        return { posts, nextCursor };
      }
    }),
});
