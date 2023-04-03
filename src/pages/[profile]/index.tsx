import Head from "next/head";
import { api } from "~/utils/api";

const ProfilePage = ({
  username,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data, isLoading } = api.profile.getProfileByUserName.useQuery({
    username,
  });
  if (isLoading) console.log("loading");
  console.log(username, data);

  return (
    <>
      <Head>
        <title>{username} Profile / Letters</title>
      </Head>
      <div>werwer</div>
    </>
  );
};

export default ProfilePage;

import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";

export const getStaticProps: GetStaticProps<{ username: string }> = async (
  context
) => {
  const username = context.params?.profile;
  if (typeof username !== "string")
    throw new TRPCError({ code: "NOT_FOUND", message: "no slug" });
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });
  await ssg.profile.getProfileByUserName.prefetch({ username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
