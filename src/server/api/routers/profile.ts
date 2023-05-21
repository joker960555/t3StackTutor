import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/api/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getProfileByUserName: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const errorMessage = `${input.username} not found`;
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });
      if (!user) {
        const users = await clerkClient.users.getUserList({ limit: 200 });
        const user = users.find((user) =>
          user.externalAccounts.find(
            (account) => account.username === input.username
          )
        );
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: errorMessage,
          });
        }
        return filterUserForClient(user);
      }
      return filterUserForClient(user);
    }),
});
