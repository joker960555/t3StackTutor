import Head from "next/head";
import { api } from "~/utils/api";
import { CreateProfileView } from "~/components/createProfileView/CreateProfileView";

export type ProfilePageType = InferGetStaticPropsType<typeof getStaticProps>;
const ProfilePage = ({
  username,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: prefetchData, isLoading } =
    api.profile.getProfileByUserName.useQuery({
      username,
    });
  // const fetchMorePosts = (authorId: string, skipCount: number) => {
  //   const { data: posts } = api.posts.getPostsByUserId.useQuery({
  //     authorId,
  //     skipCount,
  //   });
  //   if (!posts)
  //     throw new TRPCError({ code: "NOT_FOUND", message: "no more posts" });
  //   console.log(posts);
  // };
  // useEffect(() => {
  // if (prefetchData) {
  //   const { data: posts } = api.posts.getPostsByUserId.useQuery({
  //     authorId: prefetchData?.filteredUser.authorId,
  //     skipCount: skipCountPosts,
  //   });
  //   if (!posts)
  //     throw new TRPCError({ code: "NOT_FOUND", message: "no more posts" });
  //   console.log(posts);
  // }
  // }, [skipCountPosts]);
  if (isLoading) console.log("loading");
  if (!prefetchData) return <div />;

  return (
    <>
      <Head>
        <title>{username} Profile / Letters</title>
      </Head>
      <CreateProfileView data={prefetchData} />
    </>
  );
};

export default ProfilePage;

import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import { generateSSGHelper } from "~/server/api/helpers/generateSSGHelper";
import { TRPCError } from "@trpc/server";

export const getStaticProps: GetStaticProps<{ username: string }> = async (
  context
) => {
  const username = context.params?.profile;
  if (typeof username !== "string")
    throw new TRPCError({ code: "NOT_FOUND", message: "no slug" });
  const ssg = generateSSGHelper();
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
