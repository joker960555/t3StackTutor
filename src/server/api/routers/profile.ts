import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/api/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getProfileByUserName: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const errorMessage = `${input.username} not found`;
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });
      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: errorMessage,
        });
      const filteredUser = filterUserForClient(user);
      const userPosts = await ctx.prisma.post.findMany({
        where: { authorId: { contains: filteredUser.authorId } },
        take: 10,
        orderBy: [{ createdAt: "desc" }],
      });
      return { filteredUser, userPosts };
    }),
});
