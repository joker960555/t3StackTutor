import { api } from "~/utils/api";
import type { Comment } from "@prisma/client";

export const getAllInfinitePostsOrByUserId = ({
  authorId,
}: {
  authorId?: string | undefined;
}) => {
  const limit = 20;
  return api.posts.getAllInfinitePostsOrByUserId.useInfiniteQuery(
    {
      authorId,
      limit,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: 5000,
      refetchOnMount: true,
    }
  );
};

export const infiniteCommentsByPostId = ({
  postId,
}: Pick<Comment, "postId">) => {
  const limit = 15;
  return api.comments.getInfiniteComments.useInfiniteQuery(
    {
      postId,
      limit,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: 5000,
      refetchOnMount: true,
    }
  );
};
