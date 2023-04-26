import { api, type RouterOutputs } from "~/utils/api";
type userProfileType = RouterOutputs["profile"]["getProfileByUserName"];
import type { Comment } from "@prisma/client";

export const infinitePostsByUserId = ({
  authorId,
}: Pick<userProfileType, "authorId">) => {
  const limit = 10;
  return api.posts.getInfinitePostsByUserId.useInfiniteQuery(
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
  const limit = 10;
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
