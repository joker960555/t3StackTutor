import Head from "next/head";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);
import { CreatePostView } from "~/components/createPostView/CreatePostView";
import { CommentForm } from "~/components/createCommentForm/CreateCommentForm";
import { CreateReplyList } from "~/components/createReplyList/CreateReplyList";

type userProfileType = RouterOutputs["profile"]["getProfileByUserName"];
const PostPage = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data } = api.posts.getUniquePostById.useQuery({ id });
  if (!data) return <div />;
  const { data: comments } = api.comments.getAll.useQuery({ postId: data.id });
  console.log(comments);
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
          <span className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-gray-900">
            &#8592;
          </span>
        </Link>
        <div className="flex flex-col ">
          <span className="text-lg font-semibold leading-6">{username}</span>
          <span className="text-xs font-light text-gray-400 ">dude</span>
        </div>
      </header>
      <div className="w-full border-b border-gray-600"></div>
      <CreatePostView {...data} />
      <div>
        <CommentForm postId={data.id} />
        {/* LIST OF COMMENTS */}
        <CreateReplyList {...userData} postId={postId} />{" "}
      </div>
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
