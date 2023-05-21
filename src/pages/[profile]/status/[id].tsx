import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";
import cn from "classnames";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);
import { CreatePostView } from "~/components/createPostView/CreatePostView";
import { CommentForm } from "~/components/createCommentForm/CreateCommentForm";
// import { CreateReplyList } from "~/components/createReplyList/CreateReplyList";
import { CreateCommentList } from "~/components/createReplyList/CreateCommentList";

type userProfileType = RouterOutputs["profile"]["getProfileByUserName"];
const PostPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data } = api.posts.getUniquePostById.useQuery({ id });
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!data) return <div />;
  if (!mounted) return null;
  const { username, content, profileImageUrl, authorId } = data;
  const userData: userProfileType = { authorId, profileImageUrl, username };
  const postId = data.id;
  const headerTitle =
    content.length > 5 ? `${content.slice(0, 4)}...` : content;
  return (
    <>
      <Head>
        <title>
          {username} / {headerTitle} / Profile / Letters
        </title>
      </Head>
      <header className=" flex cursor-pointer items-center gap-x-8 px-2 py-1">
        <Link className="" href={"/"}>
          <span
            className={cn(
              "active-scale-100 flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-105",
              {
                ["hover:bg-gray-700"]: theme === "dark",
                ["hover:bg-gray-400"]: theme === "light",
              }
            )}
          >
            &#8592;
          </span>
        </Link>
        <div className="flex flex-col ">
          <span className="text-lg font-semibold leading-6">{username}</span>
          <span
            className={cn("text-xs font-light text-gray-400", {
              ["text-gray-400"]: theme === "dark",
              ["text-gray-500"]: theme === "light",
            })}
          >
            dude
          </span>
        </div>
      </header>
      <div className="w-full border-gray-600"></div>
      <CreatePostView {...data} />
      <CommentForm postId={data.id} />
      {/* LIST OF COMMENTS */}
      <CreateCommentList {...userData} postId={postId} />
    </>
  );
};

export default PostPage;

import { TRPCError } from "@trpc/server";
import type {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import { generateSSGHelper } from "~/server/api/helpers/generateSSGHelper";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const getStaticProps: GetStaticProps<{ id: string }> = async (
  context
) => {
  const id = context.params?.id;

  if (typeof id !== "string")
    throw new TRPCError({ code: "NOT_FOUND", message: "slug not found" });

  const ssg = generateSSGHelper();
  await ssg.posts.getUniquePostById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
