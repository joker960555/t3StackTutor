import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const likesRouter = createTRPCRouter({
  toggleLikeToPost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const data = { userId: ctx.userId, postId };
      const existingLike = await ctx.prisma.postLike.findUnique({
        where: { userId_postId: data },
        include: { post: { select: { likeCount: true } } },
      });
      if (!!!existingLike) {
        await ctx.prisma.postLike.create({ data });
        await ctx.prisma.post.update({
          where: { id: postId },
          select: { likeCount: true },
          data: { likeCount: { increment: 1 } },
        });

        return { addedLike: true };
      } else {
        await ctx.prisma.postLike.delete({
          where: { userId_postId: data },
        });
        await ctx.prisma.post.update({
          where: { id: postId },
          select: { likeCount: true },
          data: { likeCount: { decrement: 1 } },
        });
        return { addedLike: false };
      }
    }),
  toggleLikeToComment: privateProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const data = { userId: ctx.userId, commentId };
      const existingLike = await ctx.prisma.commentLike.findUnique({
        where: { userId_commentId: data },
        include: { comment: { select: { likeCount: true } } },
      });
      if (!!!existingLike) {
        await ctx.prisma.commentLike.create({ data });
        await ctx.prisma.comment.update({
          where: { id: commentId },
          select: { likeCount: true },
          data: { likeCount: { increment: 1 } },
        });
        return { addedLike: true };
      } else {
        await ctx.prisma.commentLike.delete({
          where: { userId_commentId: data },
        });
        await ctx.prisma.comment.update({
          where: { id: commentId },
          select: { likeCount: true },
          data: { likeCount: { decrement: 1 } },
        });
        return { addedLike: false };
      }
    }),
});
