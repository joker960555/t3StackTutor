import { z } from "zod";
import { bindUserDataToPosts } from "~/server/api/helpers/bindUserDataToReplies";

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
import { rateLimitHelper } from "~/server/api/helpers/rateLimitHelper";

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
      const { success } = await rateLimitHelper.limit(authorId);
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
  getAllInfinitePosts: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(20).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      // If !comments in DB to bind userData to, return [] to the client
      const postsWithUserData =
        posts.length > 0 ? await bindUserDataToPosts(posts) : [];
      return { posts: postsWithUserData, nextCursor };
    }),
  getInfinitePostsByUserId: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        limit: z.number().min(1).max(50),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, authorId, limit } = input;

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: { authorId: { contains: authorId } },
        orderBy: { createdAt: "desc" },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      // const postsWithUserData = bindUserDataToPosts(posts);
      return { posts, nextCursor };
    }),
  removeUniquePostById: privateProcedure
    .input(z.object({ id: z.string(), authorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, authorId } = input;
      if (authorId !== ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the author of this post",
        });
      }
      await ctx.prisma.post.delete({ where: { id } });
    }),
});
