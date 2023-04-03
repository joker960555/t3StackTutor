import Head from "next/head";
import { api } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";
import { CreatePostView } from "~/components/createPostView/CreatePostView";

const ProfilePage = ({
  username,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data, isLoading } = api.profile.getProfileByUserName.useQuery({
    username,
  });
  if (isLoading) console.log("loading");
  if (!data) return <div />;
  const { authorId, profileImageUrl } = data.filteredUser;
  console.log(username, data);
  const postWithUser = data.userPosts.map((post) => {
    return { ...post, authorId, profileImageUrl, username };
  });

  return (
    <>
      <Head>
        <title>{username} Profile / Letters</title>
      </Head>
      <header className=" flex cursor-pointer items-center gap-x-8 px-2 py-1">
        <Link className="" href={"/"}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-gray-900">
            &#8592;
          </span>
        </Link>
        <div className="flex flex-col ">
          <span className="text-lg font-semibold leading-6">{username}</span>
          <span className="text-xs font-light text-gray-400 ">dude</span>
        </div>
      </header>
      <section className=" relative block h-48 bg-gradient-to-r from-yellow-400 to-blue-800 ">
        <Image
          src={profileImageUrl}
          alt={`${username}'s profile image`}
          height={200}
          width={200}
          className="absolute left-5 top-full h-32 w-32 -translate-y-1/2 rounded-full outline outline-4 outline-black  "
        ></Image>
      </section>
      <section className="px-5">
        <div className="h-24"></div>
        <span className="text-lg font-semibold leading-6">{username}</span>
      </section>
      <section className="border-t border-gray-600">
        {postWithUser.map((post) => {
          return <CreatePostView {...post} key={post.id} />;
        })}
      </section>
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
