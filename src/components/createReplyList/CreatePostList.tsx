import type { RouterOutputs } from "~/utils/api";
import { CreatePostView } from "~/components/createPostView/CreatePostView";
import { LoadingPlate } from "../loading";
import { getAllInfinitePostsOrByUserId } from "~/server/api/helpers/infiniteQueries";
import cn from "classnames";
import InfiniteScroll from "react-infinite-scroll-component";

type PostsFromInfiniteQuery =
  RouterOutputs["posts"]["getAllInfinitePostsOrByUserId"]["posts"][number];
type InfinitePostsProps = {
  isError: boolean;
  isLoading: boolean;
  hasMore: boolean;
  fetchNewPosts: () => Promise<unknown>;
  posts?: PostsFromInfiniteQuery[];
};

const InfiniteListFeed = ({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore,
}: InfinitePostsProps) => {
  if (isLoading) return <LoadingPlate />;
  if (isError) return <h1>Error</h1>;

  if (posts == null || posts.length === 0)
    return (
      <h1 className="mt-3 text-center text-2xl text-gray-700 dark:text-gray-500">
        No Posts
      </h1>
    );

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNewPosts}
        hasMore={hasMore}
        loader={""}
      >
        {posts.map((post) => {
          return <CreatePostView {...post} key={post.id} />;
        })}
      </InfiniteScroll>
    </div>
  );
};
export const CreatePostList = ({
  authorId,
}: {
  authorId?: string | undefined;
}) => {
  const { data, hasNextPage, fetchNextPage, isError, isLoading } =
    getAllInfinitePostsOrByUserId({ authorId: authorId });
  return (
    <>
      <section
        className={cn(
          `${authorId ? "border-t" : " border-t-0"} h-full border-gray-600`
        )}
      >
        <InfiniteListFeed
          posts={data?.pages.flatMap((page) => page.posts)}
          isError={isError}
          isLoading={isLoading}
          hasMore={hasNextPage ?? false}
          fetchNewPosts={fetchNextPage}
        />
      </section>
    </>
  );
};
