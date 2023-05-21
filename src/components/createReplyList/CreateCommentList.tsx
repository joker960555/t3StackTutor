import type { RouterOutputs } from "~/utils/api";
import { CreateCommentView } from "../createCommentView/CreateCommentView";
import { LoadingPlate } from "../loading";
import type { Comment } from "@prisma/client";
import { infiniteCommentsByPostId } from "~/server/api/helpers/infiniteQueries";
import cn from "classnames";
import InfiniteScroll from "react-infinite-scroll-component";

type userProfileType = RouterOutputs["profile"]["getProfileByUserName"];
type CommentsFromInfiniteQuery =
  RouterOutputs["comments"]["getInfiniteComments"]["comments"][number];
type InfiniteCommentsProps = {
  isError: boolean;
  isLoading: boolean;
  hasMore: boolean;
  fetchNewComments: () => Promise<unknown>;
  comments?: CommentsFromInfiniteQuery[];
};

const InfiniteListFeed = ({
  comments,
  isError,
  isLoading,
  fetchNewComments,
  hasMore,
}: InfiniteCommentsProps) => {
  if (isLoading) return <LoadingPlate />;
  if (isError) return <h1>Error</h1>;

  if (comments == null || comments.length === 0) {
    return (
      <h1 className="mt-3 text-center text-2xl text-gray-700 dark:text-gray-500">
        No Comments
      </h1>
    );
  }

  return (
    <div className="overflow-visible">
      <InfiniteScroll
        dataLength={comments.length}
        next={fetchNewComments}
        hasMore={hasMore}
        loader={<LoadingPlate />}
      >
        {comments.map((comment) => {
          return <CreateCommentView {...comment} key={comment.id} />;
        })}
      </InfiniteScroll>
    </div>
  );
};
export const CreateCommentList = ({
  postId,
}: userProfileType & Pick<Comment, "postId">) => {
  const { data, hasNextPage, fetchNextPage, isError, isLoading } =
    infiniteCommentsByPostId({ postId });
  return (
    <>
      <section className={cn(" border-gray-600")}>
        <InfiniteListFeed
          comments={data?.pages.flatMap((page) => page.comments)}
          isError={isError}
          isLoading={isLoading}
          hasMore={hasNextPage ?? false}
          fetchNewComments={fetchNextPage}
        />
      </section>
    </>
  );
};
