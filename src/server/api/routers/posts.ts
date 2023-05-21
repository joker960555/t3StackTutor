import { z } from "zod";
import { bindUserDataToPosts } from "~/server/api/helpers/bindUserDataToReplies";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { rateLimitHelper } from "~/server/api/helpers/rateLimitHelper";

export const postsRouter = createTRPCRouter({
  getUniquePostById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const currentUserId = ctx.userId;
      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: { id },
        include: {
          likes:
            currentUserId === null
              ? false
              : { where: { userId: currentUserId } },
        },
      });
      const postWithUserData = (await bindUserDataToPosts([post]))[0];
      if (!postWithUserData) throw new TRPCError({ code: "NOT_FOUND" });
      return {
        ...postWithUserData,
        likedByMe: post.likes?.length > 0,
      };
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
  getAllInfinitePostsOrByUserId: publicProcedure
    .input(
      z.object({
        authorId: z.string().optional(),
        limit: z.number().min(1).max(50).optional().default(40),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, authorId, limit } = input;
      const currentUserId = ctx.userId;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: !authorId ? undefined : { authorId: { contains: authorId } },
        include: {
          likes:
            currentUserId === null
              ? false
              : { where: { userId: currentUserId } },
        },
        orderBy: { createdAt: "desc" },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      const postsWithUserData =
        posts && posts.length > 0 ? await bindUserDataToPosts(posts) : [];
      return {
        posts: postsWithUserData.map((post) => {
          return {
            ...post,
            likedByMe: post.likes?.length > 0,
          };
        }),
        nextCursor,
      };
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
