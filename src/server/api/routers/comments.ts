import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { rateLimitHelper } from "~/server/api/helpers/rateLimitHelper";
import { bindUserDataToComments } from "../helpers/bindUserDataToReplies";

export const commentsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      const comments = await ctx.prisma.comment.findMany({
        take: 100,
        where: { postId },
        orderBy: [{ createdAt: "desc" }],
      });
      return bindUserDataToComments(comments);
    }),
  createComment: privateProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z
          .string()
          .min(1, { message: "Comment must contain at least 1 character(s)" })
          .max(255, {
            message: "Comment must contain at max 255 character(s)",
          }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { postId, content } = input;

      const { success } = await rateLimitHelper.limit(authorId);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You exceeded the limit of 1 post per 10 seconds",
        });
      const comment = await ctx.prisma.comment.create({
        data: { postId, content, authorId },
      });
      return comment;
    }),
  getInfiniteComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { postId, cursor, limit } = input;
      const comments = await ctx.prisma.comment.findMany({
        where: { postId },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        orderBy: [{ createdAt: "desc" }],
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.id;
      }
      return { comments, nextCursor };
    }),
});
